#!/usr/bin/env python3
"""여러 PDF 파일을 첨부한 순서대로 이어붙여 새 파일로 저장합니다."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from pypdf import PdfReader, PdfWriter

from pdf_page_extractor import build_output_path, get_pdf_page_count


def validate_pdf_paths(source_paths: list[Path]) -> None:
    """이어붙일 PDF 경로 목록을 검증합니다."""
    if len(source_paths) < 2:
        raise ValueError("이어붙일 PDF 파일은 2개 이상 필요합니다.")

    for source_path in source_paths:
        if not source_path.exists():
            raise FileNotFoundError(f"PDF 파일을 찾을 수 없습니다: {source_path}")
        if source_path.suffix.lower() != ".pdf":
            raise ValueError(f"PDF 파일만 처리할 수 있습니다: {source_path.name}")

        total_pages = get_pdf_page_count(source_path)
        if total_pages == 0:
            raise ValueError(f"페이지가 없는 PDF입니다: {source_path.name}")


def merge_pdfs(source_paths: list[Path], output_path: Path) -> int:
    """지정한 순서대로 PDF를 이어붙여 저장하고 총 페이지 수를 반환합니다."""
    writer = PdfWriter()
    total_pages = 0

    for source_path in source_paths:
        reader = PdfReader(str(source_path))
        for page in reader.pages:
            writer.add_page(page)
            total_pages += 1

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("wb") as output_file:
        writer.write(output_file)

    return total_pages


def run_merge(
    source_paths: list[Path],
    output_dir: Path,
    output_path: Path | None = None,
) -> Path:
    """PDF 이어붙이기를 실행하고 저장된 파일 경로를 반환합니다."""
    validate_pdf_paths(source_paths)

    destination = output_path or build_output_path(source_paths[0], output_dir=output_dir)
    merge_pdfs(source_paths, destination)
    return destination


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="여러 PDF 파일을 첨부한 순서대로 이어붙여 새 파일로 저장합니다."
    )
    parser.add_argument(
        "pdf_paths",
        nargs="+",
        help="이어붙일 PDF 파일 경로 (2개 이상, 순서대로 입력)",
    )
    parser.add_argument(
        "-o",
        "--output-dir",
        help="저장할 폴더 경로 (생략 시 첫 번째 파일과 같은 폴더)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    source_paths = [Path(path) for path in args.pdf_paths]
    output_dir = Path(args.output_dir) if args.output_dir else source_paths[0].parent

    try:
        saved_path = run_merge(source_paths, output_dir=output_dir)
    except ValueError as error:
        print(f"오류: {error}")
        return 1
    except Exception as error:
        print(f"저장 중 오류가 발생했습니다: {error}")
        return 1

    print(f"\n이어붙이기 완료: {saved_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
