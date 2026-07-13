import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAllRestaurants } from "./api/restaurants";
import Footer from "./components/Footer";
import Header from "./components/Header";
import RestaurantCard from "./components/RestaurantCard";
import SearchBar from "./components/SearchBar";
import { filterRestaurants } from "./utils/restaurant";
import "./App.css";

const PAGE_SIZE = 12;

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [baseDate, setBaseDate] = useState("-");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        const result = await fetchAllRestaurants();
        if (cancelled) return;

        setRestaurants(result.data);
        setTotalCount(result.totalCount);
        setBaseDate(result.baseDate);
      } catch (err) {
        if (cancelled) return;
        setError(`데이터를 불러오지 못했습니다. ${err.message}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayRestaurants = isSearchActive
    ? filterRestaurants(restaurants, searchKeyword)
    : restaurants;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, displayRestaurants.length));
  }, [displayRestaurants.length]);

  const visibleRestaurants = displayRestaurants.slice(0, visibleCount);
  const hasMore = visibleCount < displayRestaurants.length;

  useEffect(() => {
    if (loading || error || !hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loading, error, hasMore, loadMore]);

  function handleSearch() {
    const keyword = searchInput.trim();
    if (!keyword) {
      handleResetSearch();
      return;
    }

    setSearchKeyword(keyword);
    setIsSearchActive(true);
    setVisibleCount(PAGE_SIZE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleResetSearch() {
    setSearchInput("");
    setSearchKeyword("");
    setIsSearchActive(false);
    setVisibleCount(PAGE_SIZE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Header
        totalCount={totalCount}
        visibleCount={visibleRestaurants.length}
        baseDate={baseDate}
        loading={loading}
        isSearchActive={isSearchActive}
        searchKeyword={searchKeyword}
        searchResultCount={displayRestaurants.length}
      />

      <main className="main">
        {!loading && !error && (
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={handleSearch}
            disabled={loading}
          />
        )}

        {loading && <p className="status">전체 음식점 정보를 불러오는 중입니다...</p>}

        {!loading && error && <p className="status status--error">{error}</p>}

        {!loading && !error && isSearchActive && (
          <section className="search-result">
            <div className="search-result__header">
              <h2 className="search-result__title">
                &quot;{searchKeyword}&quot; 검색 결과
              </h2>
              <p className="search-result__count">
                총 {displayRestaurants.length.toLocaleString()}곳을 찾았습니다.
              </p>
              <button className="search-result__reset" type="button" onClick={handleResetSearch}>
                전체 목록으로
              </button>
            </div>

            {displayRestaurants.length === 0 ? (
              <p className="status">검색 결과가 없습니다. 다른 검색어로 다시 시도해 보세요.</p>
            ) : (
              <>
                <ul className="restaurant-list">
                  {visibleRestaurants.map((restaurant, index) => (
                    <RestaurantCard
                      key={restaurant["연번"] ?? index}
                      restaurant={restaurant}
                      index={index}
                    />
                  ))}
                </ul>

                {hasMore && (
                  <div className="scroll-sentinel" ref={sentinelRef}>
                    <p className="scroll-sentinel__text">스크롤하면 더 불러옵니다...</p>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {!loading && !error && !isSearchActive && restaurants.length > 0 && (
          <>
            <ul className="restaurant-list">
              {visibleRestaurants.map((restaurant, index) => (
                <RestaurantCard key={restaurant["연번"] ?? index} restaurant={restaurant} index={index} />
              ))}
            </ul>

            {hasMore && (
              <div className="scroll-sentinel" ref={sentinelRef}>
                <p className="scroll-sentinel__text">스크롤하면 더 불러옵니다...</p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
