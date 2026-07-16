"""
메일 발송 자동화 — Flask + Tailwind UI
"""

from __future__ import annotations

import smtplib
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

import pandas as pd
from flask import Flask, jsonify, render_template, request

BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__, template_folder=str(BASE_DIR / "templates"))

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SEND_INTERVAL_SEC = 1.5

TO_ALIASES = ("이메일", "email", "메일주소", "받는사람이메일", "수신자", "to")
SUBJECT_ALIASES = ("메일제목", "제목", "subject")
BODY_ALIASES = ("메일내용", "내용", "본문", "body")
NAME_ALIASES = ("고객명", "이름", "성명", "name")


def find_column(columns: list[str], aliases: tuple[str, ...]) -> str | None:
    lower_map = {str(c).strip().lower(): c for c in columns if c is not None}
    for alias in aliases:
        if alias.lower() in lower_map:
            return lower_map[alias.lower()]
    return None


def normalize_mails(df: pd.DataFrame) -> tuple[list[dict], dict[str, str]]:
    columns = [str(c) for c in df.columns]
    mapping = {
        "to": find_column(columns, TO_ALIASES),
        "subject": find_column(columns, SUBJECT_ALIASES),
        "body": find_column(columns, BODY_ALIASES),
        "name": find_column(columns, NAME_ALIASES),
    }
    missing = [k for k, v in mapping.items() if k != "name" and v is None]
    if missing:
        labels = {"to": "받는 사람(이메일)", "subject": "메일제목", "body": "메일내용"}
        needed = ", ".join(labels[m] for m in missing)
        raise ValueError(f"필수 컬럼을 찾지 못했습니다: {needed}. 현재: {', '.join(columns)}")

    rows: list[dict] = []
    for _, row in df.iterrows():
        to_addr = str(row[mapping["to"]]).strip() if pd.notna(row[mapping["to"]]) else ""
        subject = (
            str(row[mapping["subject"]]).strip() if pd.notna(row[mapping["subject"]]) else ""
        )
        body = str(row[mapping["body"]]).strip() if pd.notna(row[mapping["body"]]) else ""
        name = ""
        if mapping["name"] and pd.notna(row[mapping["name"]]):
            name = str(row[mapping["name"]]).strip()

        if not to_addr or not subject or not body or to_addr.lower() == "nan":
            continue

        rows.append(
            {
                "번호": len(rows) + 1,
                "고객명": name or "-",
                "받는사람": to_addr,
                "메일제목": subject,
                "메일내용": body,
            }
        )

    if not rows:
        raise ValueError("발송 가능한 행이 없습니다. 이메일·제목·내용을 확인해 주세요.")

    return rows, {k: v for k, v in mapping.items() if v}


def build_message(sender: str, to_addr: str, subject: str, body: str) -> MIMEMultipart:
    msg = MIMEMultipart()
    msg["From"] = sender
    msg["To"] = to_addr
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain", "utf-8"))
    return msg


def send_mails(sender: str, app_password: str, mails: list[dict]) -> tuple[int, int, list[str]]:
    success = 0
    failed = 0
    logs: list[str] = []
    password = app_password.strip().replace(" ", "")
    total = len(mails)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(sender, password)

        for i, mail in enumerate(mails, start=1):
            try:
                msg = build_message(
                    sender, mail["받는사람"], mail["메일제목"], mail["메일내용"]
                )
                server.sendmail(sender, [mail["받는사람"]], msg.as_string())
                success += 1
                logs.append(f"[{i}/{total}] 성공 — {mail['고객명']} <{mail['받는사람']}>")
            except Exception as exc:  # noqa: BLE001
                failed += 1
                logs.append(
                    f"[{i}/{total}] 실패 — {mail['고객명']} <{mail['받는사람']}>: {exc}"
                )

            if i < total:
                time.sleep(SEND_INTERVAL_SEC)

    return success, failed, logs


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/api/parse")
def api_parse():
    uploaded = request.files.get("file")
    if not uploaded or not uploaded.filename:
        return jsonify({"ok": False, "error": "엑셀 파일을 선택해 주세요."}), 400

    try:
        df = pd.read_excel(uploaded, engine="openpyxl")
        mails, mapping = normalize_mails(df)
        return jsonify(
            {
                "ok": True,
                "count": len(mails),
                "mapping": mapping,
                "mails": mails,
                "filename": uploaded.filename,
            }
        )
    except Exception as exc:  # noqa: BLE001
        return jsonify({"ok": False, "error": str(exc)}), 400


@app.post("/api/send")
def api_send():
    data = request.get_json(silent=True) or {}
    sender = str(data.get("sender", "")).strip()
    app_password = str(data.get("appPassword", "")).strip()
    mails = data.get("mails") or []
    limit = data.get("limit")

    if not sender or "@" not in sender:
        return jsonify({"ok": False, "error": "보내는 사람 이메일을 확인해 주세요."}), 400
    if not app_password:
        return jsonify({"ok": False, "error": "Gmail 앱 비밀번호를 입력해 주세요."}), 400
    if not isinstance(mails, list) or not mails:
        return jsonify({"ok": False, "error": "발송할 메일이 없습니다."}), 400

    try:
        limit_n = int(limit) if limit is not None else len(mails)
    except (TypeError, ValueError):
        limit_n = len(mails)

    targets = mails[: max(1, min(limit_n, len(mails)))]

    try:
        success, failed, logs = send_mails(sender, app_password, targets)
        return jsonify(
            {
                "ok": True,
                "success": success,
                "failed": failed,
                "logs": logs,
            }
        )
    except smtplib.SMTPAuthenticationError:
        return (
            jsonify(
                {
                    "ok": False,
                    "error": "SMTP 인증 실패 — 이메일과 앱 비밀번호를 확인해 주세요.",
                }
            ),
            401,
        )
    except Exception as exc:  # noqa: BLE001
        return jsonify({"ok": False, "error": f"전송 중 오류: {exc}"}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8501, debug=True)
