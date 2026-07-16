# 09 해외 주식 크롤링 프로그램 만들기

[Yahoo Finance 상승 주식 페이지](https://finance.yahoo.com/markets/stocks/gainers/)에서 당일 상승률이 높은 미국 주식 데이터를 크롤링하고, 엑셀 파일로 정리하는 Python 프로그램입니다.

---

## 개요

이 프로젝트는 웹 페이지에 표시된 주식 시세 표를 읽어와 엑셀 시트로 저장합니다. 브라우저에서 보이는 표와 동일한 데이터를 수집하며, 차트 아이콘용 빈 열이나 `--` 같은 의미 없는 값은 자동으로 제외합니다.

**수집 대상 사이트**

- [Top Stock Gainers (Yahoo Finance)](https://finance.yahoo.com/markets/stocks/gainers/)

**사용 기술**

| 구분 | 라이브러리 / 도구 |
|------|-------------------|
| HTTP 요청 | Python 표준 라이브러리 (`urllib`) |
| HTML 파싱 | BeautifulSoup4 |
| 엑셀 저장 | openpyxl |

---

## 폴더 구조

```
09 해외 주식 크롤링 프로그램 만들기/
├── crawl_stocks.py           # 크롤링 및 엑셀 저장 스크립트
├── requirements.txt          # Python 패키지 목록
├── stock_gainers_yahoo.xlsx  # 실행 결과 엑셀 파일 (실행 후 생성)
└── README.md
```

---

## 사전 준비

- **Python 3.10 이상** 권장
- 인터넷 연결 필요 (Yahoo Finance 페이지 접속)

---

## 설치

프로젝트 폴더로 이동한 뒤 필요한 패키지를 설치합니다.

```bash
cd "09 해외 주식 크롤링 프로그램 만들기"
pip3 install -r requirements.txt
```

`requirements.txt`에 포함된 패키지:

```
beautifulsoup4>=4.12.0
openpyxl>=3.1.0
```

---

## 사용법

### 기본 실행

가장 간단한 방법입니다. 기본 URL에서 데이터를 가져와 `stock_gainers_yahoo.xlsx`에 저장합니다.

```bash
python3 crawl_stocks.py
```

**실행 예시 출력**

```
Yahoo Finance 상승 주식 데이터를 가져오는 중...
저장 완료: .../stock_gainers_yahoo.xlsx
총 25건 저장
```

> macOS에서 SSL 인증서 오류가 발생하면, 스크립트가 자동으로 검증을 건너뛰고 재시도합니다. 이 경우 `주의: SSL 인증서 검증을 건너뛰고 페이지에 연결했습니다.` 메시지가 표시될 수 있습니다.

### 출력 파일 경로 지정

엑셀 파일을 다른 이름이나 위치에 저장할 수 있습니다.

```bash
python3 crawl_stocks.py --output ./data/gainers_2026-07-09.xlsx
```

### URL 지정

기본 URL 대신 다른 Yahoo Finance 페이지를 지정할 수 있습니다.

```bash
python3 crawl_stocks.py --url "https://finance.yahoo.com/markets/stocks/gainers/"
```

### 옵션 조합 예시

```bash
python3 crawl_stocks.py \
  --url "https://finance.yahoo.com/markets/stocks/gainers/" \
  --output ./results/today_gainers.xlsx
```

### 도움말 보기

```bash
python3 crawl_stocks.py --help
```

---

## CLI 옵션

| 옵션 | 기본값 | 설명 |
|------|--------|------|
| `--url` | `https://finance.yahoo.com/markets/stocks/gainers/` | 크롤링할 페이지 URL |
| `--output` | `stock_gainers_yahoo.xlsx` | 저장할 엑셀 파일 경로 |

---

## 출력 엑셀 형식

저장되는 엑셀 파일은 **Day Gainers** 시트 하나로 구성됩니다.

| 열 이름 | 설명 | 예시 |
|---------|------|------|
| Symbol | 종목 티커 | `PENG` |
| Name | 회사명 | `Penguin Solutions, Inc.` |
| Price | 현재가 (USD) | `78.47` |
| Change | 전일 대비 변동액 | `+15.76` |
| Change % | 전일 대비 변동률 | `+25.13%` |
| Volume | 당일 거래량 | `13.699M` |
| Avg Vol (3M) | 3개월 평균 거래량 | `3.279M` |
| Market Cap | 시가총액 | `4.124B` |
| P/E Ratio (TTM) | 주가수익비율 (최근 12개월) | `6.76` (없으면 빈 칸) |
| 52 Wk Change % | 52주 변동률 | `+234.91%` |
| 52 Wk Range | 52주 최저~최고가 | `16.04 80.00` |

**엑셀 미리보기 (일부)**

| Symbol | Name | Price | Change | Change % | Volume |
|--------|------|-------|--------|----------|--------|
| PENG | Penguin Solutions, Inc. | 78.47 | +15.76 | +25.13% | 13.699M |
| WULF | TeraWulf Inc. | 22.83 | +2.59 | +12.80% | 40.23M |
| PARR | Par Pacific Holdings, Inc. | 68.57 | +7.11 | +11.57% | 1.493M |

> 실제 값은 실행 시점의 시장 데이터에 따라 달라집니다.

---

## 동작 원리 (상세 설명)

### 1. 페이지 HTML 가져오기 (`fetch_html`)

`urllib`로 Yahoo Finance 페이지에 HTTP 요청을 보냅니다. 서버가 gzip으로 압축한 응답은 자동으로 해제합니다. 일반 브라우저와 유사하게 `User-Agent` 헤더를 설정해 페이지 접근이 차단되지 않도록 합니다.

### 2. 표 데이터 파싱 (`parse_gainers_table`)

HTML에서 `class="yf-1hgjbtd bd"` 속성을 가진 `<table>` 태그를 찾습니다. 이 표가 페이지에 표시되는 상승 주식 목록입니다.

BeautifulSoup으로 `<tbody>` 안의 각 `<tr>` 행을 순회하며 셀 값을 읽습니다.

**처리 규칙**

- **차트 아이콘 열 제외**: 표의 3번째 열은 차트 링크용 빈 칸이므로 수집하지 않습니다.
- **가격 열 정리**: 웹 페이지의 Price 열은 `78.47 +15.76 (+25.13%)`처럼 여러 정보가 합쳐져 있으므로, 맨 앞의 현재가 숫자만 추출합니다.
- **의미 없는 값 무시**: `--`, `-`, `N/A` 등은 빈 문자열로 저장합니다.

### 3. 엑셀 저장 (`save_to_excel`)

`openpyxl`로 엑셀 파일을 생성합니다. 헤더 행은 파란 배경·흰 글씨로 스타일을 적용하고, 데이터 셀은 가운데 정렬과 테두리를 넣어 읽기 쉽게 정리합니다.

---

## 처리 흐름

```
Yahoo Finance 페이지
        │
        ▼
  HTML 다운로드 (fetch_html)
        │
        ▼
  표 파싱 (parse_gainers_table)
   · yf-1hgjbtd bd 테이블 탐색
   · 행별 11개 컬럼 추출
        │
        ▼
  엑셀 저장 (save_to_excel)
        │
        ▼
  stock_gainers_yahoo.xlsx
```

---

## 주의 사항

1. **수집 건수**: 기본 페이지에는 한 번에 약 25개 종목이 표시됩니다. 페이지 하단에 `1-25 of 147`처럼 전체 건수가 더 많을 수 있으나, 이 스크립트는 **현재 페이지에 렌더링된 표만** 수집합니다.
2. **사이트 구조 변경**: Yahoo Finance가 HTML 구조나 CSS 클래스명을 바꾸면 크롤링이 실패할 수 있습니다. 이 경우 `TABLE_CLASS` 상수를 확인해야 합니다.
3. **실시간 데이터**: 주식 시장이 열려 있는 시간과 닫혀 있는 시간에 따라 표시되는 데이터가 달라집니다.
4. **이용 목적**: 개인 학습·실습 용도로 사용하세요. 상업적 이용이나 과도한 요청은 해당 사이트 이용 약관을 확인해야 합니다.

---

## 문제 해결

| 증상 | 가능한 원인 | 해결 방법 |
|------|-------------|-----------|
| `표를 찾을 수 없습니다` | 페이지 HTML 구조 변경 | 브라우저 개발자 도구로 표의 `class` 값 확인 후 `crawl_stocks.py`의 `TABLE_CLASS` 수정 |
| `가져온 데이터가 없습니다` | 네트워크 오류 또는 빈 페이지 | 인터넷 연결 확인 후 재실행 |
| SSL 인증서 오류 | macOS Python 인증서 미설치 | 스크립트가 자동 재시도하거나, Python 공식 설치 프로그램의 "Install Certificates" 실행 |
| `pip3: command not found` | pip 미설치 | `python3 -m pip install -r requirements.txt` 사용 |

---

## 참고

- [Yahoo Finance — Top Stock Gainers](https://finance.yahoo.com/markets/stocks/gainers/)
- [BeautifulSoup 문서](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [openpyxl 문서](https://openpyxl.readthedocs.io/)
