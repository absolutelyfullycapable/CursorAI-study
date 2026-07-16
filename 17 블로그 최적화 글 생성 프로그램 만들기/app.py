"""
블로그 최적화 글 생성 — Flask 웹 UI
키워드 + 관련 자료를 받아 Claude API로 블로그 글을 생성합니다.
"""

from __future__ import annotations

import os
from datetime import datetime
from pathlib import Path

from anthropic import Anthropic
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

from generate_blog import (
    DEFAULT_MODEL,
    DEFAULT_OUTPUT_DIR,
    DEFAULT_STYLE,
    MAX_VIEWPOINT_CHARS,
    STYLE_LABELS,
    generate_blog,
    normalize_style,
    normalize_viewpoint,
    sanitize_filename,
)

BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__, template_folder=str(BASE_DIR / "templates"))

MAX_MATERIAL_CHARS = 50_000


def get_client() -> Anthropic:
    load_dotenv(BASE_DIR / ".env")
    api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError(
            "ANTHROPIC_API_KEY가 없습니다. .env 파일에 API 키를 넣어 주세요."
        )
    return Anthropic(api_key=api_key)


def read_uploaded_text(file_storage) -> str:
    if file_storage is None or not file_storage.filename:
        return ""
    raw = file_storage.read()
    for encoding in ("utf-8", "utf-8-sig", "cp949", "euc-kr"):
        try:
            return raw.decode(encoding).strip()
        except UnicodeDecodeError:
            continue
    raise ValueError("텍스트 파일 인코딩을 읽을 수 없습니다. UTF-8로 저장해 주세요.")


@app.get("/")
def index():
    return render_template(
        "index.html",
        model=DEFAULT_MODEL,
        max_viewpoint=MAX_VIEWPOINT_CHARS,
    )


@app.post("/api/generate")
def api_generate():
    keyword = (request.form.get("keyword") or "").strip()
    material_paste = (request.form.get("material") or "").strip()
    save = (request.form.get("save") or "1") == "1"

    if not keyword:
        return jsonify({"ok": False, "error": "키워드를 입력해 주세요."}), 400

    try:
        viewpoint = normalize_viewpoint(request.form.get("viewpoint") or "")
    except ValueError as exc:
        return jsonify({"ok": False, "error": str(exc)}), 400

    try:
        style = normalize_style(request.form.get("style") or DEFAULT_STYLE)
    except ValueError as exc:
        return jsonify({"ok": False, "error": str(exc)}), 400

    try:
        material_file = read_uploaded_text(request.files.get("material_file"))
    except ValueError as exc:
        return jsonify({"ok": False, "error": str(exc)}), 400

    material = material_file or material_paste
    if not material:
        return jsonify(
            {
                "ok": False,
                "error": "관련 자료를 텍스트로 붙여넣거나 .txt 파일을 업로드해 주세요.",
            }
        ), 400

    if len(material) > MAX_MATERIAL_CHARS:
        return jsonify(
            {
                "ok": False,
                "error": f"관련 자료가 너무 깁니다. {MAX_MATERIAL_CHARS:,}자 이하로 줄여 주세요.",
            }
        ), 400

    try:
        client = get_client()
        post = generate_blog(
            client, DEFAULT_MODEL, keyword, material, viewpoint, style
        )
    except RuntimeError as exc:
        return jsonify({"ok": False, "error": str(exc)}), 500
    except Exception as exc:  # noqa: BLE001
        return jsonify({"ok": False, "error": f"생성 실패: {exc}"}), 500

    saved_path = None
    if save:
        DEFAULT_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{sanitize_filename(keyword)}_{stamp}.md"
        out = DEFAULT_OUTPUT_DIR / filename
        out.write_text(post + "\n", encoding="utf-8")
        saved_path = str(out.resolve())

    return jsonify(
        {
            "ok": True,
            "keyword": keyword,
            "style": STYLE_LABELS[style],
            "model": DEFAULT_MODEL,
            "post": post,
            "saved_path": saved_path,
        }
    )


if __name__ == "__main__":
    load_dotenv(BASE_DIR / ".env")
    app.run(host="127.0.0.1", port=8517, debug=True)
