#!/usr/bin/env python3
"""키워드와 관련 자료(텍스트)를 합쳐 Claude API로 블로그 글을 생성합니다."""

from __future__ import annotations

import argparse
import os
import re
import sys
from datetime import datetime
from pathlib import Path

from anthropic import Anthropic
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_OUTPUT_DIR = BASE_DIR / "posts"
DEFAULT_MATERIAL_DIR = BASE_DIR / "materials"

# 창의적 글쓰기 + 가성비: Haiku 4.5 ($1/$5 per 1M tokens)
DEFAULT_MODEL = "claude-haiku-4-5"

MAX_VIEWPOINT_CHARS = 200

STYLE_FRIENDLY = "friendly"
STYLE_SERIOUS = "serious"
DEFAULT_STYLE = STYLE_FRIENDLY
STYLE_LABELS = {
    STYLE_FRIENDLY: "친근하게",
    STYLE_SERIOUS: "진지하게",
}
STYLE_GUIDE = {
    STYLE_FRIENDLY: (
        "말투는 친근하고 편안한 구어체입니다. "
        "가벼운 비유와 공감 표현을 쓰고, 독자와 대화하듯 풀어 주세요. "
        "딱딱한 설명조·과도한 전문 용어는 피하세요."
    ),
    STYLE_SERIOUS: (
        "말투는 진지하고 차분한 문어체입니다. "
        "논리와 근거를 분명히 하고, 과장·농담은 줄이세요. "
        "신뢰감 있는 톤으로 깊이 있게 전달하세요."
    ),
}

SYSTEM_PROMPT = """당신은 한국어 블로그 작가이자 SEO를 고려하는 콘텐츠 에디터입니다.
독자가 끝까지 읽고 싶어지는, 창의적이고 개성 있는 글을 씁니다.
작성자의 관점을 글의 중심 톤·주장으로 삼고, 관련 자료의 사실·수치·인용으로 뒷받침하세요.
자료를 그대로 베끼지 말고 자연스러운 스토리와 비유·사례·질문으로 재구성하세요.
자료에 없는 내용을 사실인 것처럼 단정하지 마세요.
지정된 글 스타일을 글 전체에 일관되게 지키세요.
마크다운으로 작성하고, 제목·소제목·본문 흐름이 자연스럽게 이어지게 하세요."""

USER_PROMPT_TEMPLATE = """키워드: {keyword}

작성자의 관점:
{viewpoint}

글 스타일: {style_label}
스타일 가이드: {style_guide}

아래는 키워드와 관련된 참고 자료입니다.
키워드 · 작성자 관점 · 글 스타일 · 관련 자료를 함께 활용해 창의적인 블로그 글 1편을 작성해 주세요.

=== 관련 자료 시작 ===
{material}
=== 관련 자료 끝 ===

요구사항:
- 분량: 800~1,500자 내외
- 첫 줄에 `#` 제목 (키워드를 자연스럽게 포함)
- 서론 → 본론(소제목 2~3개) → 마무리 구조
- 작성자의 관점이 글 전체에 분명하게 드러날 것
- 지정된 글 스타일을 처음부터 끝까지 유지할 것
- 관련 자료의 핵심 정보·인사이트는 꼭 녹여 쓰기
- 자료를 나열하지 말고, 독자에게 도움이 되는 글로 재구성
- 키워드를 억지로 반복하지 말 것
- 독자에게 질문하거나 생각해 볼 거리를 남기기
- 해시태그 3~5개를 글 맨 아래에 추가
"""


def normalize_viewpoint(viewpoint: str) -> str:
    text = (viewpoint or "").strip()
    if not text:
        raise ValueError("나의 관점을 입력해 주세요.")
    if len(text) > MAX_VIEWPOINT_CHARS:
        raise ValueError(
            f"나의 관점은 {MAX_VIEWPOINT_CHARS}자 이하로 입력해 주세요. "
            f"(현재 {len(text)}자)"
        )
    return text


def normalize_style(style: str) -> str:
    key = (style or "").strip().lower()
    aliases = {
        STYLE_FRIENDLY: STYLE_FRIENDLY,
        "친근하게": STYLE_FRIENDLY,
        "친근": STYLE_FRIENDLY,
        STYLE_SERIOUS: STYLE_SERIOUS,
        "진지하게": STYLE_SERIOUS,
        "진지": STYLE_SERIOUS,
    }
    if key not in aliases:
        raise ValueError("글 스타일은 '친근하게' 또는 '진지하게' 중 하나여야 합니다.")
    return aliases[key]


def sanitize_filename(keyword: str) -> str:
    """파일명에 쓸 수 있도록 키워드를 정리합니다."""
    cleaned = re.sub(r'[\\/:*?"<>|]', "_", keyword.strip())
    cleaned = re.sub(r"\s+", "_", cleaned)
    return cleaned[:50] or "blog"


def resolve_material_path(raw: str) -> Path:
    """자료 경로를 해석합니다. 상대 경로는 현재 폴더·materials/ 순으로 찾습니다."""
    path = Path(raw).expanduser()
    if path.is_file():
        return path.resolve()

    candidates = [
        Path.cwd() / raw,
        BASE_DIR / raw,
        DEFAULT_MATERIAL_DIR / raw,
        DEFAULT_MATERIAL_DIR / Path(raw).name,
    ]
    for candidate in candidates:
        if candidate.is_file():
            return candidate.resolve()

    raise FileNotFoundError(f"관련 자료 파일을 찾을 수 없습니다: {raw}")


def read_material(path: Path) -> str:
    text = path.read_text(encoding="utf-8").strip()
    if not text:
        raise ValueError(f"관련 자료 파일이 비어 있습니다: {path}")
    return text


def generate_blog(
    client: Anthropic,
    model: str,
    keyword: str,
    material: str,
    viewpoint: str,
    style: str = DEFAULT_STYLE,
) -> str:
    viewpoint = normalize_viewpoint(viewpoint)
    style = normalize_style(style)
    response = client.messages.create(
        model=model,
        max_tokens=2560,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": USER_PROMPT_TEMPLATE.format(
                    keyword=keyword,
                    material=material,
                    viewpoint=viewpoint,
                    style_label=STYLE_LABELS[style],
                    style_guide=STYLE_GUIDE[style],
                ),
            }
        ],
    )
    parts: list[str] = []
    for block in response.content:
        if getattr(block, "type", None) == "text":
            parts.append(block.text)
    return "\n".join(parts).strip()


def prompt_input(message: str) -> str:
    try:
        return input(message).strip()
    except EOFError:
        return ""


def main() -> int:
    parser = argparse.ArgumentParser(
        description="키워드 + 관련 자료(텍스트)로 Claude API 블로그 글을 생성합니다."
    )
    parser.add_argument(
        "keyword",
        nargs="?",
        help="블로그 글의 주제 키워드 (생략 시 대화형 입력)",
    )
    parser.add_argument(
        "material",
        nargs="?",
        help="관련 자료 텍스트 파일 경로 (생략 시 대화형 입력)",
    )
    parser.add_argument(
        "-m",
        "--material-file",
        dest="material_opt",
        help="관련 자료 텍스트 파일 경로 (--material 과 동일)",
    )
    parser.add_argument(
        "-v",
        "--viewpoint",
        default="",
        help=f"나의 관점 (최대 {MAX_VIEWPOINT_CHARS}자, 생략 시 대화형 입력)",
    )
    parser.add_argument(
        "-s",
        "--style",
        default=DEFAULT_STYLE,
        choices=[STYLE_FRIENDLY, STYLE_SERIOUS, "친근하게", "진지하게"],
        help="글 스타일: friendly(친근하게) / serious(진지하게)",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help=f"글 저장 폴더 (기본값: {DEFAULT_OUTPUT_DIR})",
    )
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        help=f"Claude 모델 ID (기본값: {DEFAULT_MODEL})",
    )
    parser.add_argument(
        "--no-save",
        action="store_true",
        help="파일로 저장하지 않고 화면에만 출력합니다.",
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

    keyword = (args.keyword or "").strip()
    if not keyword:
        keyword = prompt_input("키워드를 입력하세요: ")
    if not keyword:
        print("오류: 키워드를 입력해 주세요.", file=sys.stderr)
        return 1

    viewpoint = (args.viewpoint or "").strip()
    if not viewpoint:
        viewpoint = prompt_input(
            f"나의 관점을 입력하세요 (최대 {MAX_VIEWPOINT_CHARS}자): "
        )
    try:
        viewpoint = normalize_viewpoint(viewpoint)
    except ValueError as exc:
        print(f"오류: {exc}", file=sys.stderr)
        return 1

    try:
        style = normalize_style(args.style)
    except ValueError as exc:
        print(f"오류: {exc}", file=sys.stderr)
        return 1

    material_raw = (args.material_opt or args.material or "").strip()
    if not material_raw:
        hint = (
            f"관련 자료 텍스트 파일 경로를 입력하세요 "
            f"(예: materials/sample.txt): "
        )
        material_raw = prompt_input(hint)
    if not material_raw:
        print("오류: 관련 자료 파일 경로를 입력해 주세요.", file=sys.stderr)
        return 1

    try:
        material_path = resolve_material_path(material_raw)
        material_text = read_material(material_path)
    except (FileNotFoundError, ValueError, OSError) as exc:
        print(f"오류: {exc}", file=sys.stderr)
        return 1

    client = Anthropic(api_key=api_key)

    print(f"모델: {args.model}")
    print(f"키워드: {keyword}")
    print(f"나의 관점: {viewpoint}")
    print(f"글 스타일: {STYLE_LABELS[style]}")
    print(f"관련 자료: {material_path} ({len(material_text)}자)")
    print("블로그 글 생성 중...\n")

    try:
        post = generate_blog(
            client, args.model, keyword, material_text, viewpoint, style
        )
    except Exception as exc:  # noqa: BLE001
        print(f"오류: 생성 실패 — {exc}", file=sys.stderr)
        return 1

    print("=" * 60)
    print(post)
    print("=" * 60)

    if not args.no_save:
        args.output_dir.mkdir(parents=True, exist_ok=True)
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{sanitize_filename(keyword)}_{stamp}.md"
        out = args.output_dir / filename
        out.write_text(post + "\n", encoding="utf-8")
        print(f"\n저장: {out.resolve()}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
