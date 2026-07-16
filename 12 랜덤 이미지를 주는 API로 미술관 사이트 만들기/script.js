const IMAGE_COUNT = 30;
const IMAGE_SIZE = 300;
const API_BASE = "https://picsum.photos";

const TITLES = [
  "고요한 순간", "빛의 잔향", "시간의 흔적", "창밖 풍경", "그림자의 춤",
  "아침 안개", "황혼의 노래", "잊힌 기억", "파도의 속삭임", "숲속 산책",
  "별빛 아래", "도시의 밤", "고독한 나무", "물결 위", "빛나는 순간",
  "멀리서 본 풍경", "조용한 호수", "구름 사이", "황금빛 들판", "겨울 아침",
  "바람의 길", "석양의 노을", "푸른 하늘", "고요한 바다", "산맥의 실루엣",
  "이른 새벽", "빗방울", "안개 낀 다리", "황금 시간", "마지막 빛",
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

function buildImageUrl(seed, size = IMAGE_SIZE) {
  return `${API_BASE}/seed/${seed}/${size}`;
}

function createArtwork(index) {
  const seed = `exhibit-${index + 1}`;
  const number = String(index + 1).padStart(2, "0");
  const title = TITLES[index];

  const article = document.createElement("article");
  article.className = "artwork";
  article.style.setProperty("--i", index);
  article.setAttribute("role", "listitem");

  const frame = document.createElement("div");
  frame.className = "artwork__frame";
  frame.tabIndex = 0;
  frame.setAttribute("aria-label", `작품 ${number} — ${title}`);

  const img = document.createElement("img");
  img.className = "artwork__img";
  img.src = buildImageUrl(seed);
  img.alt = `전시 작품 ${number}: ${title}`;
  img.loading = index < 6 ? "eager" : "lazy";
  img.width = IMAGE_SIZE;
  img.height = IMAGE_SIZE;

  const plaque = document.createElement("div");
  plaque.className = "artwork__plaque";
  plaque.innerHTML = `
    <span class="artwork__number">No. ${number}</span>
    <span class="artwork__title">${title}</span>
  `;

  frame.appendChild(img);
  article.appendChild(frame);
  article.appendChild(plaque);

  const openLightbox = () => {
    lightboxImg.src = buildImageUrl(seed, 800);
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = `No. ${number} — ${title}`;
    lightbox.hidden = false;
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  };

  frame.addEventListener("click", openLightbox);
  frame.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLightbox();
    }
  });

  return article;
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  document.body.style.overflow = "";
  setTimeout(() => {
    lightbox.hidden = true;
    lightboxImg.src = "";
  }, 300);
}

for (let i = 0; i < IMAGE_COUNT; i++) {
  gallery.appendChild(createArtwork(i));
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
});
