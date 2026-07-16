#!/usr/bin/env python3
"""한국거래소 주식 API 프록시 + 정적 파일 서버."""

from __future__ import annotations

import json
import os
import re
import ssl
import urllib.error
import urllib.parse
import urllib.request
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

API_KEY = os.environ.get("DATA_GO_KR_API_KEY", "")
API_URL = (
    "https://apis.data.go.kr/1160100/service/"
    "GetStockSecuritiesInfoService/getStockPriceInfo"
)
ROOT = Path(__file__).resolve().parent
PAGE_SIZE = 1000
TOP_COUNT = 50


def fetch_page(page_no: int, bas_dt: str | None = None) -> dict:
    params = {
        "serviceKey": API_KEY,
        "numOfRows": str(PAGE_SIZE),
        "pageNo": str(page_no),
        "resultType": "json",
    }
    if bas_dt:
        params["basDt"] = bas_dt

    query = urllib.parse.urlencode(params)
    request = urllib.request.Request(f"{API_URL}?{query}")

    contexts = [ssl.create_default_context(), ssl._create_unverified_context()]
    last_error: Exception | None = None

    for context in contexts:
        try:
            with urllib.request.urlopen(request, context=context, timeout=30) as response:
                return json.loads(response.read().decode("utf-8"))
        except (urllib.error.URLError, OSError, json.JSONDecodeError) as error:
            last_error = error

    raise RuntimeError("주식 API 호출에 실패했습니다.") from last_error


def normalize_items(payload: dict) -> list[dict]:
    body = payload.get("response", {}).get("body", {})
    items = body.get("items", {}).get("item", [])
    if isinstance(items, dict):
        return [items]
    return items or []


def get_latest_bas_dt() -> str:
    payload = fetch_page(1)
    items = normalize_items(payload)
    if not items:
        raise RuntimeError("최신 기준일자를 찾을 수 없습니다.")
    return items[0]["basDt"]


def fetch_all_for_date(bas_dt: str) -> list[dict]:
    first = fetch_page(1, bas_dt)
    body = first.get("response", {}).get("body", {})
    total_count = int(body.get("totalCount", 0))
    stocks = normalize_items(first)

    total_pages = max(1, (total_count + PAGE_SIZE - 1) // PAGE_SIZE)
    for page_no in range(2, total_pages + 1):
        stocks.extend(normalize_items(fetch_page(page_no, bas_dt)))

    return stocks


def validate_bas_dt(bas_dt: str) -> str:
    if not re.fullmatch(r"\d{8}", bas_dt):
        raise ValueError("날짜는 YYYYMMDD 형식이어야 합니다.")
    return bas_dt


def get_top_stocks(bas_dt: str | None = None) -> dict:
    if bas_dt:
        bas_dt = validate_bas_dt(bas_dt)
    else:
        bas_dt = get_latest_bas_dt()

    stocks = fetch_all_for_date(bas_dt)
    if not stocks:
        raise RuntimeError(f"{bas_dt} 기준 주식 시세 데이터가 없습니다.")

    ranked = sorted(
        stocks,
        key=lambda stock: int(stock.get("clpr") or 0),
        reverse=True,
    )[:TOP_COUNT]

    return {
        "basDt": bas_dt,
        "count": len(ranked),
        "stocks": ranked,
    }


class DashboardHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/top-stocks":
            self.send_api_response(parsed)
            return
        super().do_GET()

    def send_api_response(self, parsed: urllib.parse.ParseResult) -> None:
        try:
            params = urllib.parse.parse_qs(parsed.query)
            bas_dt = params.get("basDt", [None])[0]
            payload = get_top_stocks(bas_dt)
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except Exception as error:
            body = json.dumps({"error": str(error)}, ensure_ascii=False).encode("utf-8")
            self.send_response(500)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    def log_message(self, format: str, *args) -> None:
        print(f"[{self.log_date_time_string()}] {format % args}")


def main() -> None:
    if not API_KEY:
        raise SystemExit(
            "환경 변수 DATA_GO_KR_API_KEY 가 설정되지 않았습니다.\n"
            "예: export DATA_GO_KR_API_KEY='발급받은-API-키'"
        )

    port = 8080
    server = HTTPServer(("127.0.0.1", port), DashboardHandler)
    print(f"대시보드 서버 실행: http://127.0.0.1:{port}")
    print("종료하려면 Ctrl+C 를 누르세요.")
    server.serve_forever()


if __name__ == "__main__":
    main()
