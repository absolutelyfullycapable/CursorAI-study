#!/usr/bin/env python3
"""extracted_text 폴더의 텍스트를 Claude API로 요약합니다."""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from anthropic import Anthropic
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_INPUT_DIR = BASE_DIR / "extracted_text"
DEFAULT_OUTPUT_DIR = BASE_DIR / "summaries"

# 문서 요약에 품질·비용 균형이 좋은 모델
DEFAULT_MODEL = "claude-sonnet-5"

SYSTEM_PROMPT = """당신은 한국어 기술서 요약 전문가입니다.
주어진 책 발췌 텍스트를 읽고, 핵심만 간결하게 정리하세요.
원문의 사실과 용어를 왜곡하지 마세요."""

USER_PROMPT_TEMPLATE = """아래는 PDF에서 추출한 텍스트입니다. 파일명: {filename}

다음 형식으로 요약해 주세요.

## 한 줄 요약
(1~2문장)

## 핵심 내용
- 불릿 포인트 3~7개

## 기억할 포인트
- 실무/학습에 바로 쓸 수 있는 포인트 2~4개

---
{content}
"""

COMBINED_PROMPT_TEMPLATE = """아래는 같은 책의 여러 페이지 발췌를 각각 요약한 결과입니다.
전체를 하나의 정리본으로 합쳐 주세요.

형식:
## 전체 한 줄 요약
## 주제별 핵심 정리
## 이 발췌들에서 얻을 수 있는 것

---
{content}
"""


def list_text_files(input_dir: Path) -> list[Path]:
    if not input_dir.is_dir():
        raise FileNotFoundError(f"입력 폴더를 찾을 수 없습니다: {input_dir}")

    files = sorted(
        p for p in input_dir.iterdir() if p.is_file() and p.suffix.lower() == ".txt"
    )
    if not files:
        raise FileNotFoundError(f"텍스트 파일이 없습니다: {input_dir}")
    return files


def summarize_with_claude(
    client: Anthropic, model: str, system: str, user_content: str
) -> str:
    response = client.messages.create(
        model=model,
        max_tokens=2048,
        system=system,
        messages=[{"role": "user", "content": user_content}],
    )
    parts: list[str] = []
    for block in response.content:
        if getattr(block, "type", None) == "text":
            parts.append(block.text)
    return "\n".join(parts).strip()


def main() -> int:
    parser = argparse.ArgumentParser(
        description="extracted_text의 파일들을 Claude API로 요약합니다."
    )
    parser.add_argument(
        "--input-dir",
        type=Path,
        default=DEFAULT_INPUT_DIR,
        help=f"요약할 텍스트 폴더 (기본값: {DEFAULT_INPUT_DIR})",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help=f"요약 저장 폴더 (기본값: {DEFAULT_OUTPUT_DIR})",
    )
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        help=f"Claude 모델 ID (기본값: {DEFAULT_MODEL})",
    )
    parser.add_argument(
        "--combined-only",
        action="store_true",
        help="개별 요약 없이 전체 텍스트를 한 번에 요약합니다.",
    )
    args = parser.parse_args()

    load_dotenv(BASE_DIR / ".env")
    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        print(
            "오류: ANTHROPIC_API_KEY가 없습니다.\n"
            ".env.example을 참고해 .env에 API 키를 넣어 주세요.",
            file=sys.stderr,
        )
        return 1

    try:
        text_files = list_text_files(args.input_dir)
    except FileNotFoundError as exc:
        print(f"오류: {exc}", file=sys.stderr)
        return 1

    client = Anthropic(api_key=api_key)
    args.output_dir.mkdir(parents=True, exist_ok=True)

    print(f"모델: {args.model}")
    print(f"텍스트 {len(text_files)}개 요약 중...\n")

    individual_summaries: list[str] = []

    if args.combined_only:
        chunks = []
        for path in text_files:
            chunks.append(f"### {path.name}\n{path.read_text(encoding='utf-8')}")
        combined_source = "\n\n".join(chunks)
        summary = summarize_with_claude(
            client,
            args.model,
            SYSTEM_PROMPT,
            COMBINED_PROMPT_TEMPLATE.format(content=combined_source),
        )
        out = args.output_dir / "전체_요약.md"
        out.write_text(summary + "\n", encoding="utf-8")
        print(f"저장: {out}")
        print("\n" + summary)
        return 0

    for path in text_files:
        print(f"- {path.name}")
        content = path.read_text(encoding="utf-8")
        try:
            summary = summarize_with_claude(
                client,
                args.model,
                SYSTEM_PROMPT,
                USER_PROMPT_TEMPLATE.format(filename=path.name, content=content),
            )
        except Exception as exc:  # noqa: BLE001
            print(f"  → 실패: {exc}", file=sys.stderr)
            continue

        out = args.output_dir / f"{path.stem}_요약.md"
        out.write_text(summary + "\n", encoding="utf-8")
        individual_summaries.append(f"### {path.name}\n{summary}")
        print(f"  → 저장: {out}")

    if individual_summaries:
        print("\n전체 통합 요약 생성 중...")
        combined = summarize_with_claude(
            client,
            args.model,
            SYSTEM_PROMPT,
            COMBINED_PROMPT_TEMPLATE.format(
                content="\n\n".join(individual_summaries)
            ),
        )
        combined_path = args.output_dir / "전체_요약.md"
        combined_path.write_text(combined + "\n", encoding="utf-8")
        print(f"저장: {combined_path}")
        print("\n===== 전체 요약 =====\n")
        print(combined)

    print(f"\n완료. 결과 폴더: {args.output_dir.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
