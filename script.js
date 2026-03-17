const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const yearNode = document.getElementById("year");
const revealNodes = document.querySelectorAll(".reveal");
const processCards = document.querySelectorAll(".process-card");
const projectTrack = document.getElementById("projectTrack");
const projectPanels = document.querySelectorAll(".project-panel");
const dotButtons = document.querySelectorAll(".dot");
const prevButton = document.getElementById("projectPrev");
const nextButton = document.getElementById("projectNext");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (revealNodes.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
}

if (processCards.length) {
  const activateCard = (activeCard) => {
    processCards.forEach((card) => card.classList.remove("active"));
    activeCard.classList.add("active");
  };

  processCards.forEach((card) => {
    card.addEventListener("click", () => activateCard(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateCard(card);
      }
    });
  });
}

if (projectTrack && projectPanels.length) {
  let currentSlide = 0;
  const lastSlide = projectPanels.length - 1;
  let autoSlideTimer;

  const setSlide = (index) => {
    if (index > lastSlide) currentSlide = 0;
    else if (index < 0) currentSlide = lastSlide;
    else currentSlide = index;

    projectTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    dotButtons.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentSlide);
    });
  };

  prevButton?.addEventListener("click", () => setSlide(currentSlide - 1));
  nextButton?.addEventListener("click", () => setSlide(currentSlide + 1));

  dotButtons.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = Number(dot.dataset.slide);
      if (!Number.isNaN(target)) setSlide(target);
    });
  });

  const startAutoSlide = () => {
    autoSlideTimer = setInterval(() => setSlide(currentSlide + 1), 7000);
  };

  const stopAutoSlide = () => {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  };

  projectTrack.addEventListener("mouseenter", stopAutoSlide);
  projectTrack.addEventListener("mouseleave", startAutoSlide);

  startAutoSlide();
}

function fitPreviewFrames() {
  const wrappers = document.querySelectorAll(".preview-wrap");
  const iframeWidth = 1440;
  const iframeHeight = 900;

  wrappers.forEach((wrap) => {
    const frame = wrap.querySelector(".preview-frame");
    if (!frame) return;

    const w = wrap.offsetWidth;
    const h = wrap.offsetHeight;
    const scaleX = w / iframeWidth;
    const scaleY = h / iframeHeight;
    const scale = Math.min(scaleX, scaleY);

    frame.style.transform = `scale(${scale})`;
  });
}

const previewWraps = document.querySelectorAll(".preview-wrap");
if (previewWraps.length) {
  fitPreviewFrames();
  window.addEventListener("resize", fitPreviewFrames);

  const resizeObserver = new ResizeObserver(fitPreviewFrames);
  previewWraps.forEach((wrap) => resizeObserver.observe(wrap));
}
