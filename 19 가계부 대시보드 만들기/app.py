#!/usr/bin/env python3
"""가계부 Google 스프레드시트 데이터를 Streamlit 대시보드로 보여 줍니다."""

from __future__ import annotations

from datetime import datetime
from pathlib import Path

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st
from plotly.subplots import make_subplots

from read_spreadsheet import (
    DEFAULT_CREDENTIALS,
    DEFAULT_SPREADSHEET_ID,
    fetch_records,
    open_worksheet,
)

COLOR_INCOME = "#0F766E"
COLOR_EXPENSE = "#E11D48"
COLOR_BALANCE = "#2563EB"
CHART_PALETTE = [
    "#0F766E",
    "#E11D48",
    "#2563EB",
    "#D97706",
    "#7C3AED",
    "#0891B2",
    "#BE185D",
    "#65A30D",
    "#EA580C",
    "#475569",
]


@st.cache_data(ttl=300, show_spinner="스프레드시트에서 데이터를 불러오는 중...")
def load_dataframe(
    credentials_path: str,
    spreadsheet_id: str,
    cache_key: int,
) -> pd.DataFrame:
    """cache_key가 바뀌면 캐시를 무시하고 시트를 다시 읽습니다."""
    _ = cache_key
    worksheet = open_worksheet(Path(credentials_path), spreadsheet_id)
    records = fetch_records(worksheet)
    if not records:
        return pd.DataFrame()

    df = pd.DataFrame(records)
    df["날짜"] = pd.to_datetime(df["날짜"], format="%Y.%m.%d", errors="coerce")
    for col in ("수입", "지출", "잔액"):
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    df = df.dropna(subset=["날짜"]).sort_values("날짜").reset_index(drop=True)
    df["연월"] = df["날짜"].dt.to_period("M").astype(str)
    return df


def format_won(value: float) -> str:
    return f"{value:,.0f}원"


def is_dark_theme() -> bool:
    """Streamlit 설정/토글 기준 다크 모드 여부."""
    try:
        return st.context.theme.type == "dark"
    except Exception:  # noqa: BLE001
        return False


def apply_styles() -> None:
    st.markdown(
        """
        <style>
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

        html, body, [class*="css"] {
            font-family: "Pretendard", "Apple SD Gothic Neo", sans-serif;
        }

        /* 상단 툴바(stAppToolbar)가 제목을 가리지 않도록 여백 확보 */
        .stAppToolbar {
            z-index: 999990;
        }
        header[data-testid="stHeader"] {
            background: transparent !important;
        }
        section.stMain .block-container,
        div[data-testid="stMainBlockContainer"],
        .block-container {
            max-width: 1600px !important;
            padding-top: 6rem !important;
            padding-left: 2.2rem !important;
            padding-right: 2.2rem !important;
            padding-bottom: 2.5rem !important;
        }

        h1 {
            letter-spacing: -0.03em !important;
            font-weight: 800 !important;
        }

        /* 라이트/다크 모두 Streamlit 테마 변수 사용 */
        div[data-testid="stMetric"] {
            background: var(--secondary-background-color);
            border: 1px solid rgba(128, 128, 128, 0.22);
            border-radius: 14px;
            padding: 1rem 1.1rem;
        }
        div[data-testid="stMetric"] label {
            font-weight: 600 !important;
            opacity: 0.85;
        }
        div[data-testid="stMetric"] [data-testid="stMetricValue"] {
            font-size: 1.55rem !important;
            font-weight: 800 !important;
            color: var(--text-color) !important;
        }

        .subtle {
            color: var(--text-color);
            opacity: 0.65;
            font-size: 0.95rem;
            margin: 0.15rem 0 1rem;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


def chart_theme() -> dict[str, str]:
    if is_dark_theme():
        return {
            "font": "#e2e8f0",
            "grid": "#334155",
            "hover_bg": "#1e293b",
            "hover_font": "#f8fafc",
            "payment": "#94a3b8",
            "scale_low": "#134e4a",
        }
    return {
        "font": "#334155",
        "grid": "#e2e8f0",
        "hover_bg": "#ffffff",
        "hover_font": "#0f172a",
        "payment": "#475569",
        "scale_low": "#99f6e4",
    }


def chart_layout(fig: go.Figure, height: int = 380) -> go.Figure:
    theme = chart_theme()
    fig.update_layout(
        height=height,
        margin=dict(l=20, r=20, t=30, b=20),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(
            family="Pretendard, Apple SD Gothic Neo, sans-serif",
            color=theme["font"],
            size=13,
        ),
        legend=dict(orientation="h", yanchor="bottom", y=1.02, x=0),
        hoverlabel=dict(
            bgcolor=theme["hover_bg"],
            font_size=13,
            font_color=theme["hover_font"],
        ),
    )
    fig.update_xaxes(showgrid=False, zeroline=False)
    fig.update_yaxes(showgrid=True, gridcolor=theme["grid"], zeroline=False)
    return fig


def monthly_chart(monthly: pd.DataFrame) -> go.Figure:
    """수입·지출을 별도 Y축으로 그려 작은 금액도 잘 보이게 합니다."""
    theme = chart_theme()
    fig = make_subplots(
        rows=2,
        cols=1,
        shared_xaxes=True,
        vertical_spacing=0.12,
        subplot_titles=("월별 수입", "월별 지출"),
        row_heights=[0.48, 0.52],
    )
    fig.add_trace(
        go.Bar(
            name="수입",
            x=monthly["연월"],
            y=monthly["수입"],
            marker_color=COLOR_INCOME,
            text=monthly["수입"].map(lambda v: f"{v:,.0f}"),
            textposition="outside",
            cliponaxis=False,
            hovertemplate="%{x}<br>수입 %{y:,.0f}원<extra></extra>",
            showlegend=False,
        ),
        row=1,
        col=1,
    )
    fig.add_trace(
        go.Bar(
            name="지출",
            x=monthly["연월"],
            y=monthly["지출"],
            marker_color=COLOR_EXPENSE,
            text=monthly["지출"].map(lambda v: f"{v:,.0f}"),
            textposition="outside",
            cliponaxis=False,
            hovertemplate="%{x}<br>지출 %{y:,.0f}원<extra></extra>",
            showlegend=False,
        ),
        row=2,
        col=1,
    )

    fig.update_layout(
        height=520,
        margin=dict(l=20, r=20, t=40, b=20),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(
            family="Pretendard, Apple SD Gothic Neo, sans-serif",
            color=theme["font"],
            size=13,
        ),
        hoverlabel=dict(
            bgcolor=theme["hover_bg"],
            font_size=13,
            font_color=theme["hover_font"],
        ),
        bargap=0.35,
    )
    fig.update_annotations(font_size=13)
    fig.update_xaxes(showgrid=False, zeroline=False)
    fig.update_yaxes(
        showgrid=True,
        gridcolor=theme["grid"],
        zeroline=False,
        tickformat=",",
        rangemode="tozero",
        # 막대 위 숫자 잘림 방지용 여유
        ticksuffix=" ",
    )
    # 각 축이 자기 데이터 최대값 기준으로 늘어나도록 상단 여유
    max_income = float(monthly["수입"].max() or 0)
    max_expense = float(monthly["지출"].max() or 0)
    fig.update_yaxes(range=[0, max_income * 1.25 if max_income else 1], row=1, col=1)
    fig.update_yaxes(range=[0, max_expense * 1.25 if max_expense else 1], row=2, col=1)
    return fig


def category_bar(by_category: pd.DataFrame) -> go.Figure:
    theme = chart_theme()
    data = by_category.sort_values("지출", ascending=True)
    fig = px.bar(
        data,
        x="지출",
        y="분류",
        orientation="h",
        color="지출",
        color_continuous_scale=[theme["scale_low"], COLOR_INCOME],
    )
    fig.update_traces(hovertemplate="%{y}<br>%{x:,.0f}원<extra></extra>", showlegend=False)
    fig.update_coloraxes(showscale=False)
    fig.update_xaxes(tickformat=",", title="")
    fig.update_yaxes(title="")
    return chart_layout(fig, height=400)


def balance_chart(filtered: pd.DataFrame) -> go.Figure:
    fill = "rgba(37, 99, 235, 0.22)" if is_dark_theme() else "rgba(37, 99, 235, 0.10)"
    fig = go.Figure()
    fig.add_trace(
        go.Scatter(
            x=filtered["날짜"],
            y=filtered["잔액"],
            mode="lines",
            line=dict(color=COLOR_BALANCE, width=2.8),
            fill="tozeroy",
            fillcolor=fill,
            hovertemplate="%{x|%Y-%m-%d}<br>잔액 %{y:,.0f}원<extra></extra>",
        )
    )
    fig.update_yaxes(tickformat=",")
    return chart_layout(fig, height=360)


def payment_chart(by_payment: pd.DataFrame) -> go.Figure:
    theme = chart_theme()
    data = by_payment.sort_values("지출", ascending=True)
    fig = go.Figure(
        go.Bar(
            x=data["지출"],
            y=data["결제방법"],
            orientation="h",
            marker_color=theme["payment"],
            hovertemplate="%{y}<br>%{x:,.0f}원<extra></extra>",
        )
    )
    fig.update_xaxes(tickformat=",", title="")
    fig.update_yaxes(title="")
    return chart_layout(fig, height=360)


def refresh_data() -> None:
    """캐시를 비우고 스프레드시트를 다시 읽도록 버전을 올립니다."""
    st.session_state.data_version = st.session_state.get("data_version", 0) + 1
    load_dataframe.clear()
    st.session_state.last_refreshed_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    st.rerun()


def main() -> None:
    st.set_page_config(
        page_title="가계부 대시보드",
        page_icon="📒",
        layout="wide",
        initial_sidebar_state="expanded",
    )
    apply_styles()

    if "data_version" not in st.session_state:
        st.session_state.data_version = 0

    # ----- 상단: 제목 + 화면 내 갱신 버튼 -----
    title_col, refresh_col = st.columns([5, 1.2], vertical_alignment="center")
    with title_col:
        st.title("가계부 대시보드")
    with refresh_col:
        if st.button("데이터 갱신", type="primary", use_container_width=True):
            refresh_data()

    try:
        df = load_dataframe(
            str(DEFAULT_CREDENTIALS),
            DEFAULT_SPREADSHEET_ID,
            st.session_state.data_version,
        )
    except FileNotFoundError as error:
        st.error(str(error))
        st.stop()
    except Exception as error:  # noqa: BLE001
        st.error(f"데이터를 불러오지 못했습니다: {error}")
        st.info(
            "시트가 서비스 계정 이메일과 공유되어 있는지 확인하세요.\n\n"
            "`my-automation-bot@central-pod-502502-a2.iam.gserviceaccount.com`"
        )
        st.stop()

    if df.empty:
        st.warning("표시할 데이터가 없습니다.")
        st.stop()

    months = sorted(df["연월"].unique())
    categories = sorted(df["분류"].dropna().unique())
    payment_methods = sorted(df["결제방법"].dropna().unique())

    with st.sidebar:
        st.header("필터")
        st.caption("보고 싶은 기간·분류만 선택하세요.")
        selected_months = st.multiselect("연월", months, default=months)
        selected_categories = st.multiselect("분류", categories, default=categories)
        selected_payments = st.multiselect(
            "결제방법",
            payment_methods,
            default=payment_methods,
        )
        st.divider()
        if st.button("사이드바에서 갱신", use_container_width=True):
            refresh_data()

    filtered = df[
        df["연월"].isin(selected_months)
        & df["분류"].isin(selected_categories)
        & df["결제방법"].isin(selected_payments)
    ].copy()

    if filtered.empty:
        st.warning("선택한 필터에 해당하는 데이터가 없습니다.")
        st.stop()

    total_income = float(filtered["수입"].sum())
    total_expense = float(filtered["지출"].sum())
    net = total_income - total_expense
    latest_balance = float(filtered["잔액"].iloc[-1])
    savings_rate = (net / total_income * 100) if total_income else 0.0
    expense_only = filtered[filtered["지출"] > 0]

    period_start = filtered["날짜"].min().strftime("%Y.%m.%d")
    period_end = filtered["날짜"].max().strftime("%Y.%m.%d")
    refreshed = st.session_state.get("last_refreshed_at")
    refresh_text = f" · 마지막 갱신 {refreshed}" if refreshed else ""

    st.markdown(
        f'<p class="subtle">{period_start} ~ {period_end} · '
        f"선택 {len(filtered):,}건 / 전체 {len(df):,}건{refresh_text}</p>",
        unsafe_allow_html=True,
    )

    # ----- 요약 지표 (넓은 4열) -----
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("총 수입", format_won(total_income))
    m2.metric("총 지출", format_won(total_expense))
    m3.metric("순이익", format_won(net), delta=f"저축률 {savings_rate:.1f}%")
    m4.metric("최신 잔액", format_won(latest_balance))

    st.divider()

    monthly = (
        filtered.groupby("연월", as_index=False)[["수입", "지출"]]
        .sum()
        .sort_values("연월")
    )
    by_category = (
        expense_only.groupby("분류", as_index=False)["지출"]
        .sum()
        .sort_values("지출", ascending=False)
        if not expense_only.empty
        else pd.DataFrame(columns=["분류", "지출"])
    )
    by_payment = (
        expense_only.groupby("결제방법", as_index=False)["지출"]
        .sum()
        .sort_values("지출", ascending=False)
        if not expense_only.empty
        else pd.DataFrame(columns=["결제방법", "지출"])
    )

    # ----- 차트: 넓은 2열 -----
    left, right = st.columns(2, gap="large")
    with left:
        st.subheader("월별 수입 / 지출")
        st.plotly_chart(monthly_chart(monthly), use_container_width=True)
    with right:
        st.subheader("분류별 지출")
        if by_category.empty:
            st.info("지출 데이터가 없습니다.")
        else:
            st.plotly_chart(category_bar(by_category), use_container_width=True)

    left2, right2 = st.columns(2, gap="large")
    with left2:
        st.subheader("잔액 추이")
        st.plotly_chart(balance_chart(filtered), use_container_width=True)
    with right2:
        st.subheader("결제방법별 지출")
        if by_payment.empty:
            st.info("지출 데이터가 없습니다.")
        else:
            st.plotly_chart(payment_chart(by_payment), use_container_width=True)

    st.divider()
    st.subheader("거래 내역")

    display = filtered.copy()
    display["날짜"] = display["날짜"].dt.strftime("%Y-%m-%d")
    display = display[
        ["날짜", "항목", "분류", "수입", "지출", "잔액", "결제방법", "메모"]
    ]
    st.dataframe(
        display,
        use_container_width=True,
        hide_index=True,
        height=480,
        column_config={
            "수입": st.column_config.NumberColumn(format="%d원"),
            "지출": st.column_config.NumberColumn(format="%d원"),
            "잔액": st.column_config.NumberColumn(format="%d원"),
        },
    )


if __name__ == "__main__":
    main()
