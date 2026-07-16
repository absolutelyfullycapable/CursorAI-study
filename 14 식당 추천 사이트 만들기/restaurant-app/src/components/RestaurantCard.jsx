import { formatAddress, formatArea, getBadgeClass } from "../utils/restaurant";

export default function RestaurantCard({ restaurant, index }) {
  const badgeClass = getBadgeClass(restaurant["업태명"]);
  const address = formatAddress(
    restaurant["소재지(도로명)"],
    restaurant["소재지(지번)"],
  );

  return (
    <li className="restaurant-card">
      <div className="restaurant-card__top">
        <span className="restaurant-card__rank">{index + 1}</span>
        <h2 className="restaurant-card__name">{restaurant["업소명"] || "이름 없음"}</h2>
        <span className={`restaurant-card__badge ${badgeClass}`}>
          {restaurant["업태명"] || "기타"}
        </span>
      </div>
      <p className="restaurant-card__address">{address}</p>
      <dl className="restaurant-card__details">
        <div className="restaurant-card__detail">
          <dt>업종</dt>
          <dd>{restaurant["업종명"] || "-"}</dd>
        </div>
        <div className="restaurant-card__detail">
          <dt>영업장 면적</dt>
          <dd>{formatArea(restaurant["영업장 내부면적(제곱미터)"])}</dd>
        </div>
        <div className="restaurant-card__detail">
          <dt>영업 시작일</dt>
          <dd>{restaurant["영업자시작일"] || "-"}</dd>
        </div>
        <div className="restaurant-card__detail">
          <dt>인허가일자</dt>
          <dd>{restaurant["인허가일자"] || "-"}</dd>
        </div>
      </dl>
    </li>
  );
}
