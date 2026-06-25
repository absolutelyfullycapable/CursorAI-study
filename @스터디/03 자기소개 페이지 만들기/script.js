(function () {
  "use strict";

  const spotlight = document.getElementById("spotlight");
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  /* ----- Cursor spotlight ----- */
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (spotlight && finePointer) {
    let raf = null;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    window.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!raf) {
          raf = requestAnimationFrame(() => {
            spotlight.style.setProperty("--x", mx + "px");
            spotlight.style.setProperty("--y", my + "px");
            raf = null;
          });
        }
      },
      { passive: true }
    );
  }

  /* ----- Reveal on scroll ----- */
  document
    .querySelectorAll(".section, .card")
    .forEach((el) => el.classList.add("reveal"));

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ----- Active nav link based on scroll position ----- */
  if ("IntersectionObserver" in window && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) =>
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === "#" + id
              )
            );
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((sec) => navObserver.observe(sec));
  }
})();
