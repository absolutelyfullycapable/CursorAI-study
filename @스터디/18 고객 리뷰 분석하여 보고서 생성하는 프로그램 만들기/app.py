"""
고객 리뷰 분석 보고서 — Flask 웹 UI
엑셀 업로드 후 Claude API로 경영진용 보고서를 생성합니다.
"""

from __future__ import annotations

import os
from pathlib import Path

from anthropic import Anthropic
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

from analyze_reviews import (
    DEFAULT_EXCEL,
    DEFAULT_MODEL,
    DEFAULT_OUTPUT_DIR,
    compute_metrics,
    generate_report,
    load_reviews,
    load_reviews_from_bytes,
    save_report,
)

BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__, template_folder=str(BASE_DIR / "templates"))
app.config["MAX_CONTENT_LENGTH"] = 8 * 1024 * 1024  # 8MB

ALLOWED_EXT = {".xlsx", ".xlsm", ".xls"}


def get_client() -> Anthropic:
    load_dotenv(BASE_DIR / ".env")
    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError(
            "ANTHROPIC_API_KEY가 없습니다. .env 파일에 API 키를 넣어 주세요."
        )
    return Anthropic(api_key=api_key)


@app.get("/")
def index():
    sample_name = DEFAULT_EXCEL.name if DEFAULT_EXCEL.is_file() else None
    return render_template(
        "index.html",
        model=DEFAULT_MODEL,
        sample_name=sample_name,
    )


@app.post("/api/analyze")
def api_analyze():
    use_sample = (request.form.get("use_sample") or "") == "1"
    save = (request.form.get("save") or "1") == "1"
    uploaded = request.files.get("excel")

    try:
        if use_sample:
            if not DEFAULT_EXCEL.is_file():
                return jsonify(
                    {"ok": False, "error": "샘플 엑셀 파일이 없습니다."}
                ), 400
            rows, headers = load_reviews(DEFAULT_EXCEL)
            filename = DEFAULT_EXCEL.name
            stem = DEFAULT_EXCEL.stem
        else:
            if uploaded is None or not uploaded.filename:
                return jsonify(
                    {
                        "ok": False,
                        "error": "엑셀 파일을 업로드하거나 샘플 데이터를 사용해 주세요.",
                    }
                ), 400
            ext = Path(uploaded.filename).suffix.lower()
            if ext not in ALLOWED_EXT:
                return jsonify(
                    {
                        "ok": False,
                        "error": "xlsx / xlsm / xls 파일만 업로드할 수 있습니다.",
                    }
                ), 400
            data = uploaded.read()
            if not data:
                return jsonify({"ok": False, "error": "빈 파일입니다."}), 400
            rows, headers = load_reviews_from_bytes(data, uploaded.filename)
            filename = Path(uploaded.filename).name
            stem = Path(uploaded.filename).stem
    except ValueError as exc:
        return jsonify({"ok": False, "error": str(exc)}), 400
    except Exception as exc:  # noqa: BLE001
        return jsonify({"ok": False, "error": f"엑셀 읽기 실패: {exc}"}), 400

    metrics = compute_metrics(rows, headers)

    try:
        client = get_client()
        report = generate_report(client, DEFAULT_MODEL, filename, rows, headers)
    except RuntimeError as exc:
        return jsonify({"ok": False, "error": str(exc)}), 500
    except Exception as exc:  # noqa: BLE001
        return jsonify({"ok": False, "error": f"보고서 생성 실패: {exc}"}), 500

    saved_path = None
    if save:
        out = save_report(report, DEFAULT_OUTPUT_DIR, stem)
        saved_path = str(out.resolve())

    return jsonify(
        {
            "ok": True,
            "filename": filename,
            "model": DEFAULT_MODEL,
            "metrics": metrics,
            "report": report,
            "saved_path": saved_path,
        }
    )


if __name__ == "__main__":
    load_dotenv(BASE_DIR / ".env")
    app.run(host="127.0.0.1", port=8518, debug=True)
