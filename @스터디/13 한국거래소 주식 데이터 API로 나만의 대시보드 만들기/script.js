const statusEl = document.getElementById("status");
const tableWrapEl = document.getElementById("tableWrap");
const stockBodyEl = document.getElementById("stockBody");
const baseDateEl = document.getElementById("baseDate");
const dateInputEl = document.getElementById("dateInput");
const refreshBtnEl = document.getElementById("refreshBtn");

function formatNumber(value) {
  const number = Number(value);
  if (Number.isNaN(number)) {
    return "-";
  }
  return number.toLocaleString("ko-KR");
}

function formatDate(basDt) {
  if (!basDt || basDt.length !== 8) {
    return basDt || "-";
  }
  return `${basDt.slice(0, 4)}-${basDt.slice(4, 6)}-${basDt.slice(6, 8)}`;
}

function toApiDate(dateValue) {
  return dateValue.replaceAll("-", "");
}

function toInputDate(basDt) {
  return formatDate(basDt);
}

function getChangeClass(vs) {
  const value = Number(vs);
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "flat";
}

function getMarketClass(market) {
  if (market === "KOSPI") return "market market--kospi";
  if (market === "KOSDAQ") return "market market--kosdaq";
  return "market market--konex";
}

function formatChange(vs) {
  const value = Number(vs);
  if (Number.isNaN(value)) return "-";
  if (value > 0) return `+${formatNumber(value)}`;
  return formatNumber(value);
}

function formatRate(rate) {
  const value = Number(rate);
  if (Number.isNaN(value)) return "-";
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value}%`;
}

function renderStocks(data) {
  baseDateEl.textContent = `기준일자: ${formatDate(data.basDt)} (장 마감 기준)`;
  dateInputEl.value = toInputDate(data.basDt);

  stockBodyEl.innerHTML = data.stocks
    .map((stock, index) => {
      const changeClass = getChangeClass(stock.vs);
      return `
        <tr>
          <td class="rank">${index + 1}</td>
          <td class="name">${stock.itmsNm}</td>
          <td>${stock.srtnCd}</td>
          <td><span class="${getMarketClass(stock.mrktCtg)}">${stock.mrktCtg}</span></td>
          <td class="price">${formatNumber(stock.clpr)}원</td>
          <td class="${changeClass}">${formatChange(stock.vs)}</td>
          <td class="${changeClass}">${formatRate(stock.fltRt)}</td>
          <td>${formatNumber(stock.trqu)}</td>
          <td>${formatNumber(stock.mrktTotAmt)}</td>
        </tr>
      `;
    })
    .join("");

  statusEl.hidden = true;
  tableWrapEl.hidden = false;
}

function showLoading(message = "데이터를 불러오는 중입니다...") {
  statusEl.textContent = message;
  statusEl.classList.remove("status--error");
  statusEl.hidden = false;
  tableWrapEl.hidden = true;
}

function showError(message) {
  statusEl.textContent = message;
  statusEl.classList.add("status--error");
  statusEl.hidden = false;
  tableWrapEl.hidden = true;
}

async function loadStocks(basDt) {
  showLoading();
  refreshBtnEl.disabled = true;

  try {
    const url = basDt
      ? `/api/top-stocks?basDt=${basDt}`
      : "/api/top-stocks";
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "데이터를 불러오지 못했습니다.");
    }

    renderStocks(data);
  } catch (error) {
    showError(error.message || "알 수 없는 오류가 발생했습니다.");
  } finally {
    refreshBtnEl.disabled = false;
  }
}

refreshBtnEl.addEventListener("click", () => {
  if (!dateInputEl.value) {
    showError("기준일자를 선택해 주세요.");
    return;
  }
  loadStocks(toApiDate(dateInputEl.value));
});

dateInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    refreshBtnEl.click();
  }
});

loadStocks();
