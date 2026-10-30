// ===================== Header / Navigation =====================

// ----- Dropdowns (header Elsewhere + footer menus) -----
// Each toggle points at its menu through aria-controls; only one stays open at a time.
const dropdownToggles = document.querySelectorAll("[data-dropdown-toggle]");

function getDropdownMenu(toggle) {
  return document.getElementById(toggle.getAttribute("aria-controls"));
}

function closeDropdowns(except) {
  dropdownToggles.forEach((toggle) => {
    if (toggle === except) return;
    getDropdownMenu(toggle)?.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
}

dropdownToggles.forEach((toggle) => {
  const menu = getDropdownMenu(toggle);
  if (!menu) return;

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    closeDropdowns(toggle);
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".elsewhere-menu, .footer-menu")) {
    closeDropdowns();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDropdowns();
  }
});

// ----- Hamburger nav (mobile) -----
const hamburgerToggle = document.getElementById("hamburgerToggle");
const mobileNav = document.getElementById("mobileNav");

function closeMobileNav() {
  mobileNav.classList.remove("is-open");
  hamburgerToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

function toggleMobileNav() {
  const isOpen = mobileNav.classList.toggle("is-open");
  hamburgerToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.style.overflow = isOpen ? "hidden" : "";
}

if (hamburgerToggle && mobileNav) {
  hamburgerToggle.addEventListener("click", () => {
    toggleMobileNav();
  });

  mobileNav.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNav();
    }
  });
}

// ===================== How I Work =====================
// Skill bars fill from 0 to their target width the first time they scroll into view.
const skillFills = document.querySelectorAll(".skill-fill");

if (skillFills.length) {
  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  skillFills.forEach((fill) => skillObserver.observe(fill));
}

// ===================== Work & Case Studies =====================
// Flip cards rely on :hover, which doesn't exist on touch devices,
// so tapping toggles the flip instead (one open at a time).
const flipCards = document.querySelectorAll(".flip-card");

if (flipCards.length && window.matchMedia("(hover: none)").matches) {
  flipCards.forEach((card) => {
    card.addEventListener("click", () => {
      const wasFlipped = card.classList.contains("is-flipped");
      flipCards.forEach((c) => c.classList.remove("is-flipped"));
      card.classList.toggle("is-flipped", !wasFlipped);
    });
  });
}

// ===================== Projects =====================
// App showcase columns drift at opposite speeds while scrolling (desktop only).
const appShowcase = document.querySelector(".app-showcase");

if (appShowcase && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add("(min-width: 993px) and (prefers-reduced-motion: no-preference)", () => {
    appShowcase.querySelectorAll(".app-stage").forEach((stage, index) => {
      gsap.fromTo(
        stage,
        { y: index % 2 ? 40 : -20 },
        {
          y: index % 2 ? -40 : 20,
          ease: "none",
          scrollTrigger: {
            trigger: appShowcase,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
  });
}
