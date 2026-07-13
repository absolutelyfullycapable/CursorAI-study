export function getBadgeClass(businessType) {
  if (!businessType) return "restaurant-card__badge--etc";
  if (businessType.includes("다방") || businessType.includes("커피")) {
    return "restaurant-card__badge--cafe";
  }
  if (businessType.includes("조리") || businessType.includes("분식")) {
    return "restaurant-card__badge--food";
  }
  return "restaurant-card__badge--etc";
}

export function formatAddress(road, lot) {
  return road || lot || "주소 정보 없음";
}

export function formatArea(area) {
  if (!area) return "-";
  return `${area}㎡`;
}

export function filterRestaurants(restaurants, keyword) {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) return restaurants;

  return restaurants.filter((restaurant) => {
    const name = (restaurant["업소명"] || "").toLowerCase();
    const road = (restaurant["소재지(도로명)"] || "").toLowerCase();
    const lot = (restaurant["소재지(지번)"] || "").toLowerCase();

    return (
      name.includes(normalized) ||
      road.includes(normalized) ||
      lot.includes(normalized)
    );
  });
}
