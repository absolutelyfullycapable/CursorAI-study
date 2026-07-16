"""
중앙 로고가 들어간 QR 코드를 한꺼번에 생성하는 Gradio 앱.
"""

from typing import Any

import platform
import re
import shutil
import subprocess
import tempfile
from collections import deque
import tkinter as tk
from pathlib import Path
from tkinter import filedialog

import gradio as gr
import qrcode
from PIL import Image
from qrcode.constants import ERROR_CORRECT_H

MAX_LINKS = 10
LOGO_SIZE_RATIO = 5
LOGO_PADDING_PX = 10

APP_CSS = """
.app-shell {
  max-width: 980px;
  margin: 0 auto;
  padding: 10px 6px 18px 6px;
}

.hero-card {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 16px;
  padding: 20px 22px !important;
  color: #f8fafc;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.24);
  border: 1px solid rgba(148, 163, 184, 0.22);
}

.hero-card h1, .hero-card p { color: #f8fafc !important; }
.hero-card strong {
  color: #bfdbfe !important;
  background: transparent !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  font-weight: 700 !important;
}

.panel-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px !important;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}

.btn-primary button {
  background: #2563eb !important;
  border: 1px solid #2563eb !important;
  color: #ffffff !important;
}

.btn-primary button:hover { background: #1d4ed8 !important; }

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


def create_qr_with_logo(url: str, logo_path: str, output_path: Path) -> None:
    """URL로 QR 코드를 만들고, 중앙에 흰 배경 위 로고를 올려 저장합니다."""
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    qr_width, _ = img.size

    logo_file = Path(logo_path)
    logo = Image.open(logo_file).convert("RGBA")
    max_logo_size = qr_width // LOGO_SIZE_RATIO

    # 중앙 객체를 타이트하게 잘라 정사각형 기준으로 정렬합니다.
    logo = extract_tight_subject(logo)

    # 초록/검정 헤일로를 줄이기 위해 먼저 흰 배경에 합성한 뒤 축소합니다.
    logo_rgb = Image.new("RGB", logo.size, "white")
    logo_rgb.paste(logo, (0, 0), logo)

    # 비율을 유지한 채 필요한 경우에만 축소하고, 확대는 하지 않습니다.
    logo_rgb.thumbnail((max_logo_size, max_logo_size), Image.Resampling.LANCZOS)

    # 로고 뒤 배경은 항상 정사각형으로 만들어 가로/세로 늘어난 느낌을 방지합니다.
    bg_size = max(logo_rgb.width, logo_rgb.height) + LOGO_PADDING_PX * 2
    white_bg = Image.new("RGB", (bg_size, bg_size), "white")
    paste_x = (bg_size - logo_rgb.width) // 2
    paste_y = (bg_size - logo_rgb.height) // 2
    white_bg.paste(logo_rgb, (paste_x, paste_y))

    position = ((qr_width - bg_size) // 2, (qr_width - bg_size) // 2)
    img.paste(white_bg, position)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(output_path, format="PNG")


def remove_border_white_background(logo: Image.Image, threshold: int = 245) -> Image.Image:
    """PNG 가장자리와 연결된 흰색 배경만 투명 처리해 로고 사각형 배경을 줄입니다."""
    rgba = logo.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size

    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    def is_near_white(px: tuple[int, int, int, int]) -> bool:
        r, g, b, a = px
        return a > 0 and r >= threshold and g >= threshold and b >= threshold

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))

        if x < 0 or y < 0 or x >= width or y >= height:
            continue

        px = pixels[x, y]
        if not is_near_white(px):
            continue

        pixels[x, y] = (px[0], px[1], px[2], 0)
        queue.extend([(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)])

    return rgba


def extract_tight_subject(logo: Image.Image) -> Image.Image:
    """알파/색상 기준으로 실제 로고 영역만 타이트하게 잘라 반환합니다."""
    rgba = logo.convert("RGBA")
    alpha = rgba.getchannel("A")
    alpha_bbox = alpha.getbbox()
    if alpha_bbox:
        rgba = rgba.crop(alpha_bbox)

    # 남은 이미지에서 거의 흰 배경은 객체 탐지에서 제외합니다.
    pixels = rgba.load()
    width, height = rgba.size
    min_x, min_y = width, height
    max_x, max_y = -1, -1

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            if r >= 245 and g >= 245 and b >= 245:
                continue
            if x < min_x:
                min_x = x
            if y < min_y:
                min_y = y
            if x > max_x:
                max_x = x
            if y > max_y:
                max_y = y

    if max_x >= min_x and max_y >= min_y:
        pad = 2
        left = max(0, min_x - pad)
        top = max(0, min_y - pad)
        right = min(width, max_x + pad + 1)
        bottom = min(height, max_y + pad + 1)
        rgba = rgba.crop((left, top, right, bottom))

    return rgba




def normalize_url(url: str) -> str:
    """http/https가 없으면 https를 붙입니다."""
    stripped = url.strip()
    if not stripped:
        return ""
    if stripped.startswith(("http://", "https://")):
        return stripped
    return f"https://{stripped}"


def make_output_filename(url: str, index: int) -> str:
    """저장 파일명을 만듭니다."""
    host = re.sub(r"^https?://", "", url).split("/")[0]
    host = re.sub(r"[^\w.\-]", "_", host)
    if not host:
        host = "link"
    return f"qr_{index:02d}_{host}.png"


def cleanup_temp_files(file_paths: list[str] | None) -> None:
    """이전에 생성해 둔 임시 QR 파일을 삭제합니다."""
    if not file_paths:
        return

    temp_dir = Path(file_paths[0]).parent
    if temp_dir.name.startswith("qr_preview_") and temp_dir.exists():
        shutil.rmtree(temp_dir, ignore_errors=True)


def pick_save_folder() -> tuple[Path | None, str | None]:
    """저장 폴더를 선택합니다. macOS에서는 Finder 선택 창을 사용합니다."""
    if platform.system() == "Darwin":
        cmd = [
            "osascript",
            "-e",
            'tell application "Finder" to activate',
            "-e",
            'POSIX path of (choose folder with prompt "QR 코드를 저장할 폴더를 선택하세요")',
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=False)
        if result.returncode != 0:
            err = (result.stderr or "").strip() or "폴더 선택 창 호출에 실패했습니다."
            return None, err
        selected = result.stdout.strip()
        if not selected:
            return None, None
        return Path(selected), None

    # macOS가 아닌 경우에는 Tk 파일 선택 창으로 대체합니다.
    root = tk.Tk()
    root.withdraw()
    try:
        root.attributes("-topmost", True)
    except tk.TclError:
        pass

    folder = filedialog.askdirectory(title="QR 코드를 저장할 폴더를 선택하세요")
    root.destroy()
    if not folder:
        return None, None
    return Path(folder), None


def add_link_field(visible_count: int) -> tuple:
    """링크 입력칸을 1개씩 추가합니다. 최대 10개."""
    new_count = min(visible_count + 1, MAX_LINKS)
    updates = [gr.update(visible=(i < new_count)) for i in range(MAX_LINKS)]
    add_button_update = gr.update(interactive=new_count < MAX_LINKS)
    remove_button_update = gr.update(interactive=new_count > 1)
    return (new_count, *updates, add_button_update, remove_button_update)


def remove_link_field(visible_count: int, *links: str) -> tuple:
    """링크 입력칸을 1개씩 숨깁니다. 최소 1개는 유지합니다."""
    new_count = max(1, visible_count - 1)
    updates = [gr.update(visible=(i < new_count)) for i in range(MAX_LINKS)]

    # 숨기는 마지막 입력칸은 비워 다음 생성 시 이전 값이 남지 않게 합니다.
    clear_updates: list[Any] = []
    for index in range(MAX_LINKS):
        if index >= new_count:
            clear_updates.append(gr.update(value=""))
        else:
            clear_updates.append(gr.update())

    merged_updates = []
    for visible_update, clear_update in zip(updates, clear_updates):
        merged_updates.append({**visible_update, **clear_update})

    add_button_update = gr.update(interactive=new_count < MAX_LINKS)
    remove_button_update = gr.update(interactive=new_count > 1)
    return (new_count, *merged_updates, add_button_update, remove_button_update)


def generate_qr_codes(
    logo_path: str | None,
    previous_files: list[str] | None,
    *links: str,
) -> tuple[str, Image.Image | None, list[str], Any]:
    """입력된 링크로 QR 코드를 생성하고 미리보기를 표시합니다."""
    if not logo_path:
        return "오류: 중앙에 넣을 이미지를 업로드해 주세요.", None, [], gr.update(interactive=False)

    valid_links = [normalize_url(link) for link in links if link and link.strip()]
    if not valid_links:
        return "오류: 최소 1개의 링크를 입력해 주세요.", None, [], gr.update(interactive=False)

    cleanup_temp_files(previous_files)

    temp_dir = Path(tempfile.mkdtemp(prefix="qr_preview_"))
    generated_paths: list[str] = []
    errors: list[str] = []

    for index, url in enumerate(valid_links, start=1):
        filename = make_output_filename(url, index)
        output_path = temp_dir / filename
        try:
            create_qr_with_logo(url, logo_path, output_path)
            generated_paths.append(str(output_path))
        except Exception as exc:  # noqa: BLE001
            errors.append(f"- {url}: {exc}")

    if not generated_paths:
        cleanup_temp_files(generated_paths)
        return "오류: QR 코드를 생성하지 못했습니다.\n" + "\n".join(errors), None, [], gr.update(
            interactive=False
        )

    message_lines = [
        f"생성 완료! {len(generated_paths)}개의 QR 코드를 만들었습니다.",
        "미리보기를 확인한 뒤 **저장** 버튼을 눌러 주세요.",
        "",
        "생성된 파일:",
        *[f"- {Path(path).name}" for path in generated_paths],
    ]
    if errors:
        message_lines.extend(["", "생성 실패:", *errors])

    preview = Image.open(generated_paths[0])
    return "\n".join(message_lines), preview, generated_paths, gr.update(interactive=True)


def save_qr_codes(generated_paths: list[str] | None) -> str:
    """생성된 QR 코드를 사용자가 선택한 폴더에 저장합니다."""
    if not generated_paths:
        return "오류: 먼저 **QR 코드 생성** 버튼을 눌러 주세요."

    folder, picker_error = pick_save_folder()
    if picker_error:
        return f"오류: 저장 폴더 선택 창을 열지 못했습니다. ({picker_error})"
    if folder is None:
        return "저장이 취소되었습니다."

    try:
        folder.mkdir(parents=True, exist_ok=True)
    except OSError as exc:
        return f"오류: 폴더를 사용할 수 없습니다. ({exc})"

    saved_names: list[str] = []
    errors: list[str] = []

    for src_path in generated_paths:
        src = Path(src_path)
        dest = folder / src.name
        try:
            shutil.copy2(src, dest)
            saved_names.append(dest.name)
        except OSError as exc:
            errors.append(f"- {src.name}: {exc}")

    if not saved_names:
        return "오류: QR 코드를 저장하지 못했습니다.\n" + "\n".join(errors)

    message_lines = [
        f"저장 완료! {len(saved_names)}개의 QR 코드를 저장했습니다.",
        f"저장 위치: {folder}",
        "",
        "저장된 파일:",
        *[f"- {name}" for name in saved_names],
    ]
    if errors:
        message_lines.extend(["", "저장 실패:", *errors])

    return "\n".join(message_lines)


def build_app() -> gr.Blocks:
    with gr.Blocks(title="나만의 QR 코드 생성기", css=APP_CSS, theme=gr.themes.Soft()) as demo:
        with gr.Column(elem_classes=["app-shell"]):
            gr.Markdown(
            """
            # 나만의 QR 코드 생성기
            링크와 중앙 이미지를 입력한 뒤 **QR 코드 생성**으로 미리보기를 확인하고,
            **저장** 버튼으로 Finder에서 폴더를 선택해 PNG 파일을 저장하세요.
            """,
                elem_classes=["hero-card"],
            )

            visible_count = gr.State(1)
            generated_files = gr.State([])

            with gr.Row(equal_height=True):
                with gr.Column(elem_classes=["panel-card"]):
                    logo_input = gr.Image(
                        type="filepath",
                        label="중앙에 넣을 이미지",
                        sources=["upload", "clipboard"],
                    )

                with gr.Column(elem_classes=["panel-card"]):
                    link_inputs: list[gr.Textbox] = []
                    for index in range(MAX_LINKS):
                        link_inputs.append(
                            gr.Textbox(
                                label=f"링크 {index + 1}",
                                placeholder="https://example.com (복사·붙여넣기 가능)",
                                visible=index == 0,
                                lines=1,
                            )
                        )

            with gr.Row():
                add_button = gr.Button("+ 링크 추가", variant="secondary", elem_classes=["btn-secondary"])
                remove_button = gr.Button(
                    "- 링크 삭제", variant="secondary", interactive=False, elem_classes=["btn-secondary"]
                )

            with gr.Row():
                generate_button = gr.Button("QR 코드 생성", variant="primary", elem_classes=["btn-primary"])
                save_button = gr.Button("저장", variant="secondary", interactive=False, elem_classes=["btn-secondary"])

            with gr.Row(equal_height=True):
                with gr.Column(elem_classes=["panel-card"]):
                    result_text = gr.Textbox(
                        label="결과", lines=8, interactive=False, elem_classes=["result-box"]
                    )
                with gr.Column(elem_classes=["panel-card"]):
                    preview_image = gr.Image(label="미리보기 (첫 번째 QR 코드)", interactive=False)

        add_button.click(
            fn=add_link_field,
            inputs=[visible_count],
            outputs=[visible_count, *link_inputs, add_button, remove_button],
        )

        remove_button.click(
            fn=remove_link_field,
            inputs=[visible_count, *link_inputs],
            outputs=[visible_count, *link_inputs, add_button, remove_button],
        )

        generate_button.click(
            fn=generate_qr_codes,
            inputs=[logo_input, generated_files, *link_inputs],
            outputs=[result_text, preview_image, generated_files, save_button],
        )

        save_button.click(
            fn=save_qr_codes,
            inputs=[generated_files],
            outputs=[result_text],
        )

    return demo


if __name__ == "__main__":
    app = build_app()
    app.launch()
