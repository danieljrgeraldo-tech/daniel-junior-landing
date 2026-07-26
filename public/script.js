const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress");
const spotlight = document.querySelector(".cursor-spotlight");
const heroMedia = document.querySelector(".hero-media");
const revealItems = document.querySelectorAll(".reveal");
const magneticItems = document.querySelectorAll(".magnetic");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function updateScrollState() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progressValue = scrollable > 0 ? scrollTop / scrollable : 0;

  progress.style.transform = `scaleX(${progressValue})`;
  header.classList.toggle("scrolled", scrollTop > 40);

  if (heroMedia) {
    heroMedia.style.transform = "scale(1.04)";
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealItems.forEach((item, index) => {
  item.style.setProperty("--delay", `${Math.min(index % 4, 3) * 90}ms`);
  revealObserver.observe(item);
});

const drawerStacks = document.querySelectorAll("[data-drawer-stack]");
const selectStacks = document.querySelectorAll("[data-select-stack]");

function updateDrawerFocus() {
  if (!window.matchMedia("(max-width: 820px)").matches) {
    drawerStacks.forEach((stack) => {
      stack.querySelectorAll("article").forEach((card) => card.classList.remove("is-drawer-active"));
    });
    return;
  }

  const focusLine = window.innerHeight * 0.46;

  drawerStacks.forEach((stack) => {
    const cards = [...stack.querySelectorAll("article")];
    let activeCard = cards[0];
    let nearest = Number.POSITIVE_INFINITY;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const distance = Math.abs(rect.top + Math.min(rect.height * 0.42, 120) - focusLine);
      if (distance < nearest) {
        nearest = distance;
        activeCard = card;
      }
    });

    cards.forEach((card) => card.classList.toggle("is-drawer-active", card === activeCard));
  });
}

function updateSelectionFocus() {
  const focusLine = window.innerHeight * 0.48;

  selectStacks.forEach((stack) => {
    const rows = [...stack.querySelectorAll(".terminal-line")];
    let selected = rows[0];
    let nearest = Number.POSITIVE_INFINITY;

    rows.forEach((row) => {
      const rect = row.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - focusLine);
      if (distance < nearest) {
        nearest = distance;
        selected = row;
      }
    });

    rows.forEach((row) => row.classList.toggle("is-selected", row === selected));
  });
}

window.addEventListener("scroll", () => {
  updateScrollState();
  updateDrawerFocus();
  updateSelectionFocus();
}, { passive: true });
window.addEventListener("resize", () => {
  updateScrollState();
  updateDrawerFocus();
  updateSelectionFocus();
});
updateScrollState();
updateDrawerFocus();
updateSelectionFocus();

if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener(
    "pointermove",
    (event) => {
      spotlight.style.opacity = "1";
      spotlight.style.left = `${event.clientX}px`;
      spotlight.style.top = `${event.clientY}px`;
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    spotlight.style.opacity = "0";
  });

  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.14}px, ${y * 0.2}px)`;
    });

    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });
}
