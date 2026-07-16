#!/usr/bin/env python3
"""pdf 폴더 안의 PDF 파일에서 텍스트를 추출합니다."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from pypdf import PdfReader

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_PDF_DIR = BASE_DIR / "pdf"
DEFAULT_OUTPUT_DIR = BASE_DIR / "extracted_text"


def list_pdf_files(pdf_dir: Path) -> list[Path]:
    """지정한 폴더에서 PDF 파일 목록을 반환합니다."""
    if not pdf_dir.is_dir():
        raise FileNotFoundError(f"PDF 폴더를 찾을 수 없습니다: {pdf_dir}")

    files = sorted(
        p for p in pdf_dir.iterdir() if p.is_file() and p.suffix.lower() == ".pdf"
    )
    if not files:
        raise FileNotFoundError(f"PDF 파일이 없습니다: {pdf_dir}")
    return files


def extract_text_from_pdf(pdf_path: Path) -> str:
    """단일 PDF에서 페이지별 텍스트를 추출해 하나의 문자열로 합칩니다."""
    reader = PdfReader(str(pdf_path))
    parts: list[str] = []

    for index, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        text = text.strip()
        if text:
            parts.append(f"--- 페이지 {index} ---\n{text}")
        else:
            parts.append(f"--- 페이지 {index} ---\n(추출된 텍스트 없음)")

    return "\n\n".join(parts)


def save_text(output_path: Path, content: str) -> None:
    """추출한 텍스트를 UTF-8 파일로 저장합니다."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(content, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="pdf 폴더의 PDF 파일에서 텍스트를 추출합니다."
    )
    parser.add_argument(
        "--pdf-dir",
        type=Path,
        default=DEFAULT_PDF_DIR,
        help=f"PDF가 있는 폴더 (기본값: {DEFAULT_PDF_DIR})",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help=f"텍스트를 저장할 폴더 (기본값: {DEFAULT_OUTPUT_DIR})",
    )
    parser.add_argument(
        "--print",
        action="store_true",
        help="파일 저장과 함께 터미널에도 출력합니다.",
    )
    args = parser.parse_args()

    try:
        pdf_files = list_pdf_files(args.pdf_dir)
    except FileNotFoundError as exc:
        print(f"오류: {exc}", file=sys.stderr)
        return 1

    print(f"PDF {len(pdf_files)}개 처리 중...\n")

    for pdf_path in pdf_files:
        print(f"- {pdf_path.name}")
        try:
            text = extract_text_from_pdf(pdf_path)
        except Exception as exc:  # noqa: BLE001 — 파일별 오류를 모아 계속 진행
            print(f"  → 실패: {exc}", file=sys.stderr)
            continue

        output_path = args.output_dir / f"{pdf_path.stem}.txt"
        save_text(output_path, text)
        print(f"  → 저장: {output_path}")

        if args.print:
            print("-" * 60)
            print(text)
            print("-" * 60)

        print()

    print(f"완료. 결과 폴더: {args.output_dir.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
