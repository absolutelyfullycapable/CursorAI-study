const API_KEY = "5444214caa1d37d9b6267c3095c130dddce9bcc88c14bf8dbfda2ba47e07125e";
const API_URL =
  "https://api.odcloud.kr/api/15159953/v1/uddi:c2f2c736-81f3-47ec-9421-a18636eb4edf";

const statusEl = document.getElementById("status");
const listEl = document.getElementById("restaurantList");
const metaEl = document.getElementById("dataMeta");

function getBadgeClass(businessType) {
  if (!businessType) return "restaurant-card__badge--etc";
  if (businessType.includes("다방") || businessType.includes("커피")) {
    return "restaurant-card__badge--cafe";
  }
  if (businessType.includes("조리") || businessType.includes("분식")) {
    return "restaurant-card__badge--food";
  }
  return "restaurant-card__badge--etc";
}

function formatAddress(road, lot) {
  return road || lot || "주소 정보 없음";
}

function formatArea(area) {
  if (!area) return "-";
  return `${area}㎡`;
}

function createRestaurantCard(item, index) {
  const li = document.createElement("li");
  li.className = "restaurant-card";

  const badgeClass = getBadgeClass(item["업태명"]);
  const address = formatAddress(item["소재지(도로명)"], item["소재지(지번)"]);

  li.innerHTML = `
    <div class="restaurant-card__top">
      <span class="restaurant-card__rank">${index + 1}</span>
      <h2 class="restaurant-card__name">${item["업소명"] || "이름 없음"}</h2>
      <span class="restaurant-card__badge ${badgeClass}">${item["업태명"] || "기타"}</span>
    </div>
    <p class="restaurant-card__address">${address}</p>
    <dl class="restaurant-card__details">
      <div class="restaurant-card__detail">
        <dt>업종</dt>
        <dd>${item["업종명"] || "-"}</dd>
      </div>
      <div class="restaurant-card__detail">
        <dt>영업장 면적</dt>
        <dd>${formatArea(item["영업장 내부면적(제곱미터)"])}</dd>
      </div>
      <div class="restaurant-card__detail">
        <dt>영업 시작일</dt>
        <dd>${item["영업자시작일"] || "-"}</dd>
      </div>
      <div class="restaurant-card__detail">
        <dt>인허가일자</dt>
        <dd>${item["인허가일자"] || "-"}</dd>
      </div>
    </dl>
  `;

  return li;
}

function showError(message) {
  statusEl.textContent = message;
  statusEl.classList.add("status--error");
  listEl.hidden = true;
}

async function loadRestaurants() {
  const url = new URL(API_URL);
  url.searchParams.set("page", "1");
  url.searchParams.set("perPage", "10");
  url.searchParams.set("serviceKey", API_KEY);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API 요청 실패 (${response.status})`);
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      showError("표시할 음식점 데이터가 없습니다.");
      return;
    }

    listEl.innerHTML = "";
    result.data.forEach((item, index) => {
      listEl.appendChild(createRestaurantCard(item, index));
    });

    const baseDate = result.data[0]["데이터기준일자"] || "-";
    metaEl.textContent = `총 ${result.totalCount?.toLocaleString() ?? "-"}곳 중 10곳 표시 · 데이터 기준일 ${baseDate}`;

    statusEl.hidden = true;
    listEl.hidden = false;
  } catch (error) {
    showError(`데이터를 불러오지 못했습니다. ${error.message}`);
    metaEl.textContent = "데이터를 불러오지 못했습니다.";
  }
}

loadRestaurants();
