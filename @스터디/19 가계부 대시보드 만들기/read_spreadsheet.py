#!/usr/bin/env python3
"""Google 스프레드시트 가계부 데이터를 서비스 계정으로 읽어 출력합니다."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import gspread
from google.oauth2.service_account import Credentials

ROOT = Path(__file__).resolve().parent
DEFAULT_CREDENTIALS = ROOT / "my-spreadsheet-automation.json"
DEFAULT_SPREADSHEET_ID = "1fI2TuGJwReDFOl1CkrxEXkakUGhoLSnBi5hOEwofujM"
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/drive.readonly",
]


def open_worksheet(
    credentials_path: Path,
    spreadsheet_id: str,
    worksheet_name: str | None = None,
) -> gspread.Worksheet:
    if not credentials_path.exists():
        raise FileNotFoundError(f"인증 파일을 찾을 수 없습니다: {credentials_path}")

    credentials = Credentials.from_service_account_file(
        str(credentials_path),
        scopes=SCOPES,
    )
    client = gspread.authorize(credentials)
    spreadsheet = client.open_by_key(spreadsheet_id)

    if worksheet_name:
        return spreadsheet.worksheet(worksheet_name)
    return spreadsheet.sheet1


def fetch_records(worksheet: gspread.Worksheet) -> list[dict]:
    """헤더 행을 키로 하는 딕셔너리 목록을 반환합니다."""
    return worksheet.get_all_records()


def fetch_values(worksheet: gspread.Worksheet) -> list[list]:
    """원시 셀 값(헤더 포함)을 반환합니다."""
    return worksheet.get_all_values()


def print_summary(records: list[dict]) -> None:
    print(f"총 {len(records)}건")
    if not records:
        return

    print("컬럼:", ", ".join(records[0].keys()))
    print("-" * 60)
    for index, row in enumerate(records[:5], start=1):
        print(f"[{index}] {row}")
    if len(records) > 5:
        print(f"... 외 {len(records) - 5}건")


def main() -> int:
    parser = argparse.ArgumentParser(description="가계부 스프레드시트 데이터 읽기")
    parser.add_argument(
        "--credentials",
        type=Path,
        default=DEFAULT_CREDENTIALS,
        help="서비스 계정 JSON 경로",
    )
    parser.add_argument(
        "--spreadsheet-id",
        default=DEFAULT_SPREADSHEET_ID,
        help="Google 스프레드시트 ID",
    )
    parser.add_argument(
        "--worksheet",
        default=None,
        help="읽을 시트 이름 (미지정 시 첫 번째 시트)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="전체 결과를 JSON으로 출력",
    )
    args = parser.parse_args()

    try:
        worksheet = open_worksheet(
            args.credentials,
            args.spreadsheet_id,
            args.worksheet,
        )
        records = fetch_records(worksheet)
    except FileNotFoundError as error:
        print(f"오류: {error}", file=sys.stderr)
        return 1
    except gspread.exceptions.SpreadsheetNotFound:
        print(
            "오류: 스프레드시트를 찾을 수 없습니다.\n"
            "시트를 서비스 계정 이메일과 공유했는지 확인하세요.",
            file=sys.stderr,
        )
        return 1
    except gspread.exceptions.APIError as error:
        print(f"오류: Google API 호출 실패 — {error}", file=sys.stderr)
        return 1
    except Exception as error:  # noqa: BLE001
        print(f"오류: {error}", file=sys.stderr)
        return 1

    if args.json:
        print(json.dumps(records, ensure_ascii=False, indent=2))
    else:
        print(f"시트: {worksheet.title}")
        print_summary(records)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
