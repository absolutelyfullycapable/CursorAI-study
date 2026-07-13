"""Gradio 웹 UI로 PDF 페이지를 추출하는 앱."""

from __future__ import annotations

import platform
import subprocess
import tkinter as tk
from pathlib import Path
from tkinter import filedialog

import gradio as gr

from pdf_page_extractor import get_pdf_page_count, run_extraction

APP_PORT = 17860

APP_CSS = """
.app-shell {
  max-width: 900px;
  margin: 0 auto;
  padding: 10px 6px 18px 6px;
}

.hero-card {
  background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%);
  border-radius: 16px;
  padding: 20px 22px !important;
  color: #f8fafc;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.24);
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.hero-card h1, .hero-card p { color: #f8fafc !important; }

.hero-card strong {
  color: #fbbf24 !important;
  font-weight: 700 !important;
}

.panel-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px !important;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}

.btn-primary button,
.btn-primary button span {
  background: #2563eb !important;
  border: 1px solid #1d4ed8 !important;
  color: #ffffff !important;
  font-weight: 700 !important;
}

.btn-primary button:hover,
.btn-primary button:hover span {
  background: #1d4ed8 !important;
  color: #ffffff !important;
}

.btn-secondary button {
  background: #f8fafc !important;
  border: 1px solid #cbd5e1 !important;
  color: #0f172a !important;
}

.btn-secondary button:hover { background: #f1f5f9 !important; }

.result-box textarea {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
  font-size: 13px !important;
}
"""


def pick_pdf_file() -> tuple[str, str]:
    """Finder 또는 파일 선택 창에서 PDF 파일을 고릅니다."""
    if platform.system() == "Darwin":
        cmd = [
            "osascript",
            "-e",
            'tell application "Finder" to activate',
            "-e",
            'POSIX path of (choose file with prompt "추출할 PDF 파일을 선택하세요" of type {"pdf"})',
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=False)
        if result.returncode != 0:
            err = (result.stderr or "").strip() or "파일 선택 창 호출에 실패했습니다."
            return "", f"오류: PDF 파일 선택 창을 열지 못했습니다. ({err})"
        selected = result.stdout.strip()
        if not selected:
            return "", "PDF 파일 선택이 취소되었습니다."
        path = Path(selected)
    else:
        root = tk.Tk()
        root.withdraw()
        try:
            root.attributes("-topmost", True)
        except tk.TclError:
            pass

        selected = filedialog.askopenfilename(
            title="추출할 PDF 파일을 선택하세요",
            filetypes=[("PDF 파일", "*.pdf"), ("모든 파일", "*.*")],
        )
        root.destroy()
        if not selected:
            return "", "PDF 파일 선택이 취소되었습니다."
        path = Path(selected)

    try:
        total_pages = get_pdf_page_count(path)
    except Exception as error:
        return "", f"오류: PDF를 읽을 수 없습니다. ({error})"

    info = f"선택된 파일: {path.name}\n총 {total_pages}페이지"
    return str(path), info


def pick_save_folder() -> tuple[str, str]:
    """Finder 또는 폴더 선택 창에서 저장 위치를 고릅니다."""
    if platform.system() == "Darwin":
        cmd = [
            "osascript",
            "-e",
            'tell application "Finder" to activate',
            "-e",
            'POSIX path of (choose folder with prompt "추출한 PDF를 저장할 폴더를 선택하세요")',
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=False)
        if result.returncode != 0:
            err = (result.stderr or "").strip() or "폴더 선택 창 호출에 실패했습니다."
            return "", f"오류: 저장 폴더 선택 창을 열지 못했습니다. ({err})"
        selected = result.stdout.strip()
        if not selected:
            return "", "저장 폴더 선택이 취소되었습니다."
        folder = Path(selected)
    else:
        root = tk.Tk()
        root.withdraw()
        try:
            root.attributes("-topmost", True)
        except tk.TclError:
            pass

        selected = filedialog.askdirectory(title="추출한 PDF를 저장할 폴더를 선택하세요")
        root.destroy()
        if not selected:
            return "", "저장 폴더 선택이 취소되었습니다."
        folder = Path(selected)

    return str(folder), f"저장 폴더: {folder}"


def extract_pdf_pages(pdf_path: str, page_range: str, save_folder: str) -> str:
    """입력값을 검증한 뒤 페이지 추출을 실행합니다."""
    if not pdf_path or not pdf_path.strip():
        return "오류: 먼저 **PDF 파일 선택** 버튼으로 파일을 고르세요."

    if not page_range or not page_range.strip():
        return "오류: 추출할 페이지 범위를 입력해 주세요. 예: 1-3,5,7-9"

    if not save_folder or not save_folder.strip():
        return "오류: 먼저 **저장 폴더 선택** 버튼으로 저장 위치를 고르세요."

    source_path = Path(pdf_path)
    output_dir = Path(save_folder)

    try:
        saved_path = run_extraction(
            source_path=source_path,
            page_range=page_range.strip(),
            output_dir=output_dir,
        )
    except ValueError as error:
        return f"오류: {error}"
    except Exception as error:
        return f"오류: 추출 중 문제가 발생했습니다. ({error})"

    return "\n".join(
        [
            "추출 완료!",
            f"저장 위치: {saved_path}",
            "",
            f"원본 파일: {source_path.name}",
            f"추출 범위: {page_range.strip()}",
        ]
    )


def build_app() -> gr.Blocks:
    with gr.Blocks(title="PDF 페이지 추출기") as demo:
        pdf_path_state = gr.State("")
        save_folder_state = gr.State("")

        with gr.Column(elem_classes=["app-shell"]):
            gr.Markdown(
                """
                # PDF 페이지 추출기
                PDF 파일과 저장 폴더를 선택하고, 추출할 페이지 범위를 입력한 뒤 **추출** 버튼을 누르세요.
                저장 파일명은 `원본파일명_YYYYMMDD.pdf` 형식으로 자동 생성됩니다.
                """,
                elem_classes=["hero-card"],
            )

            with gr.Column(elem_classes=["panel-card"]):
                with gr.Row():
                    pick_pdf_button = gr.Button("PDF 파일 선택", elem_classes=["btn-secondary"])
                    pick_folder_button = gr.Button("저장 폴더 선택", elem_classes=["btn-secondary"])

                pdf_info = gr.Textbox(
                    label="선택한 PDF",
                    value="아직 PDF 파일이 선택되지 않았습니다.",
                    interactive=False,
                    lines=2,
                )
                save_info = gr.Textbox(
                    label="저장 위치",
                    value="아직 저장 폴더가 선택되지 않았습니다.",
                    interactive=False,
                    lines=2,
                )
                page_range_input = gr.Textbox(
                    label="추출할 페이지 범위",
                    placeholder="예: 1-3,5,7-9",
                    lines=1,
                )

            extract_button = gr.Button("추출", variant="primary", elem_classes=["btn-primary"])

            result_text = gr.Textbox(
                label="결과",
                lines=6,
                interactive=False,
                elem_classes=["result-box"],
            )

        pick_pdf_button.click(
            fn=pick_pdf_file,
            outputs=[pdf_path_state, pdf_info],
        )
        pick_folder_button.click(
            fn=pick_save_folder,
            outputs=[save_folder_state, save_info],
        )
        extract_button.click(
            fn=extract_pdf_pages,
            inputs=[pdf_path_state, page_range_input, save_folder_state],
            outputs=[result_text],
        )

    return demo


def main() -> None:
    app = build_app()
    app.launch(
        inbrowser=True,
        server_name="127.0.0.1",
        server_port=APP_PORT,
        css=APP_CSS,
        theme=gr.themes.Soft(),
        show_error=True,
    )


if __name__ == "__main__":
    main()
