import heroImage from "../assets/hero.js";

export default function Header({
  totalCount,
  visibleCount,
  baseDate,
  loading,
  isSearchActive,
  searchKeyword,
  searchResultCount,
}) {
  let metaText = "전체 음식점 데이터를 불러오는 중...";

  if (!loading) {
    if (isSearchActive) {
      metaText = `"${searchKeyword}" 검색 결과 ${searchResultCount.toLocaleString()}곳 · ${visibleCount}곳 표시 · 데이터 기준일 ${baseDate}`;
    } else {
      metaText = `총 ${totalCount.toLocaleString()}곳 중 ${visibleCount}곳 표시 · 데이터 기준일 ${baseDate}`;
    }
  }

  return (
    <header className="header">
      <img className="header__hero" src={heroImage} alt="" width={96} height={96} />
      <p className="header__label">Seocho Restaurant Guide</p>
      <h1 className="header__title">서초구 휴게음식점 추천</h1>
      <p className="header__desc">
        공공데이터포털 · 서울특별시 서초구 휴게음식점 현황 API에서
        카페, 분식, 패스트푸드 등을 불러옵니다.
      </p>
      <p className="header__meta">{metaText}</p>
    </header>
  );
}
