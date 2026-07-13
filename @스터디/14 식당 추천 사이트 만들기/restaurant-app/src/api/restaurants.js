const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL =
  "https://api.odcloud.kr/api/15159953/v1/uddi:c2f2c736-81f3-47ec-9421-a18636eb4edf";

async function fetchPage(page, perPage) {
  const url = new URL(API_URL);
  url.searchParams.set("page", String(page));
  url.searchParams.set("perPage", String(perPage));
  url.searchParams.set("serviceKey", API_KEY);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API 요청 실패 (${response.status})`);
  }

  return response.json();
}

export async function fetchAllRestaurants() {
  const perPage = 1000;
  let page = 1;
  let allData = [];
  let totalCount = 0;

  do {
    const result = await fetchPage(page, perPage);
    totalCount = result.totalCount ?? 0;
    allData = allData.concat(result.data ?? []);
    page += 1;
  } while (allData.length < totalCount);

  return {
    data: allData,
    totalCount,
    baseDate: allData[0]?.["데이터기준일자"] ?? "-",
  };
}
