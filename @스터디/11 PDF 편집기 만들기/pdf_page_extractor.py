#!/usr/bin/env python3
"""PDF에서 특정 페이지 범위를 추출해 날짜가 붙은 새 파일로 저장합니다."""

from __future__ import annotations

import argparse
import sys
import tkinter as tk
from datetime import date
from pathlib import Path
from tkinter import filedialog

from pypdf import PdfReader, PdfWriter


def parse_page_range(page_range: str, total_pages: int) -> list[int]:
    """'1-3,5,7-9' 형식의 페이지 범위를 1부터 시작하는 페이지 번호 목록으로 변환합니다."""
    if not page_range.strip():
        raise ValueError("페이지 범위를 입력해 주세요.")

    pages: list[int] = []
    for part in page_range.split(","):
        part = part.strip()
        if not part:
            continue

        if "-" in part:
            start_text, end_text = part.split("-", 1)
            start = int(start_text.strip())
            end = int(end_text.strip())
            if start > end:
                start, end = end, start
            pages.extend(range(start, end + 1))
        else:
            pages.append(int(part))

    if not pages:
        raise ValueError("올바른 페이지 범위를 입력해 주세요. 예: 1-3,5,7-9")

    unique_pages: list[int] = []
    seen: set[int] = set()
    for page in pages:
        if page < 1 or page > total_pages:
            raise ValueError(
                f"페이지 {page}는 유효하지 않습니다. "
                f"이 PDF는 총 {total_pages}페이지입니다."
            )
        if page not in seen:
            seen.add(page)
            unique_pages.append(page)

    return unique_pages


def build_output_path(
    source_path: Path,
    output_dir: Path | None = None,
    today: date | None = None,
) -> Path:
    """원본 파일명에 날짜를 붙인 저장 경로를 만듭니다."""
    today = today or date.today()
    date_suffix = today.strftime("%Y%m%d")
    output_name = f"{source_path.stem}_{date_suffix}{source_path.suffix}"
    base_dir = output_dir if output_dir is not None else source_path.parent
    output_path = base_dir / output_name

    counter = 2
    while output_path.exists():
        output_path = base_dir / f"{source_path.stem}_{date_suffix}_{counter}{source_path.suffix}"
        counter += 1

    return output_path


def extract_pages(source_path: Path, page_numbers: list[int], output_path: Path) -> None:
    """지정한 페이지만 추출해 새 PDF 파일로 저장합니다."""
    reader = PdfReader(str(source_path))
    writer = PdfWriter()

    for page_number in page_numbers:
        writer.add_page(reader.pages[page_number - 1])

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("wb") as output_file:
        writer.write(output_file)


def choose_pdf_file() -> Path | None:
    """파일 선택 대화상자에서 PDF 파일을 고릅니다."""
    root = tk.Tk()
    root.withdraw()
    root.update()

    selected = filedialog.askopenfilename(
        title="추출할 PDF 파일을 선택하세요",
        filetypes=[("PDF 파일", "*.pdf"), ("모든 파일", "*.*")],
    )
    root.destroy()

    if not selected:
        return None
    return Path(selected)


def prompt_page_range(total_pages: int) -> str:
    """터미널에서 페이지 범위 입력을 받습니다."""
    print(f"\n이 PDF는 총 {total_pages}페이지입니다.")
    print("추출할 페이지 범위를 입력하세요. 예: 1-3,5,7-9")
    return input("페이지 범위: ").strip()


def get_pdf_page_count(source_path: Path) -> int:
    """PDF의 총 페이지 수를 반환합니다."""
    reader = PdfReader(str(source_path))
    return len(reader.pages)


def run_extraction(
    source_path: Path,
    page_range: str,
    output_path: Path | None = None,
    output_dir: Path | None = None,
) -> Path:
    """페이지 추출을 실행하고 저장된 파일 경로를 반환합니다."""
    if not source_path.exists():
        raise FileNotFoundError(f"PDF 파일을 찾을 수 없습니다: {source_path}")
    if source_path.suffix.lower() != ".pdf":
        raise ValueError("PDF 파일만 처리할 수 있습니다.")

    total_pages = get_pdf_page_count(source_path)
    if total_pages == 0:
        raise ValueError("페이지가 없는 PDF입니다.")

    page_numbers = parse_page_range(page_range, total_pages)
    if output_path is not None:
        destination = output_path
    else:
        destination = build_output_path(source_path, output_dir=output_dir)
    extract_pages(source_path, page_numbers, destination)
    return destination


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="PDF에서 특정 페이지 범위를 추출해 날짜가 붙은 새 파일로 저장합니다."
    )
    parser.add_argument(
        "pdf_path",
        nargs="?",
        help="추출할 PDF 파일 경로 (생략 시 파일 선택 창이 열립니다)",
    )
    parser.add_argument(
        "-p",
        "--pages",
        help="추출할 페이지 범위. 예: 1-3,5,7-9",
    )
    parser.add_argument(
        "-o",
        "--output",
        help="저장할 파일 경로 (생략 시 원본 파일명_YYYYMMDD.pdf)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    source_path = Path(args.pdf_path) if args.pdf_path else choose_pdf_file()
    if source_path is None:
        print("파일 선택이 취소되었습니다.")
        return 1

    try:
        total_pages = get_pdf_page_count(source_path)
    except Exception as error:
        print(f"PDF를 읽을 수 없습니다: {error}")
        return 1

    page_range = args.pages or prompt_page_range(total_pages)
    output_path = Path(args.output) if args.output else None

    try:
        saved_path = run_extraction(source_path, page_range, output_path)
    except ValueError as error:
        print(f"오류: {error}")
        return 1
    except Exception as error:
        print(f"저장 중 오류가 발생했습니다: {error}")
        return 1

    print(f"\n추출 완료: {saved_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
