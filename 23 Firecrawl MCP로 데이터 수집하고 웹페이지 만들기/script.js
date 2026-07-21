const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));

    tab.classList.add("active");
    const targetId = tab.dataset.target;
    document.getElementById(targetId)?.classList.add("active");
  });
});

const copyAddressBtn = document.getElementById("copyAddressBtn");
const addressText = document.getElementById("addressText");
const heroImage = document.getElementById("heroImage");
const foodImageOne = document.getElementById("foodImageOne");
const foodImageTwo = document.getElementById("foodImageTwo");

const embedded = window.EMBED_IMAGES || {};

if (heroImage && embedded.hero) {
  heroImage.src = embedded.hero;
}

if (foodImageOne && embedded.food) {
  foodImageOne.src = embedded.food;
}

if (foodImageTwo && embedded.hero) {
  foodImageTwo.src = embedded.hero;
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "copy-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 250);
  }, 1600);
}

copyAddressBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const text = addressText?.textContent?.trim() || "";

  if (!text) {
    showToast("복사할 주소가 없습니다.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast("주소를 복사했습니다.");
  } catch (error) {
    showToast("복사에 실패했습니다. 수동으로 복사해 주세요.");
  }
});
