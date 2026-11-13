// header

// dropdowns
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

// hamburger
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

// how i work
// skill bars and aura palette animate on scroll
const skillFills = document.querySelectorAll(".skill-fill, .palette-swatches");

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

// generic scroll reveal
// .reveal-group elements cascade to their direct .reveal children (staggered via CSS);
// standalone .reveal elements (not inside a group) animate on their own
const revealTargets = Array.from(document.querySelectorAll(".reveal, .reveal-group")).filter(
  (el) => !(el.classList.contains("reveal") && el.closest(".reveal-group"))
);

if (revealTargets.length) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }
}

// from design to code
const processVideo = document.querySelector("[data-video]");

if (processVideo) {
  const video = processVideo.querySelector("video");

  processVideo.querySelector("button").addEventListener("click", () => {
    video.play().catch(() => {});
  });

  video.addEventListener("play", () => {
    video.controls = true;
    processVideo.classList.add("is-playing");
  });

  video.addEventListener("ended", () => {
    video.controls = false;
    processVideo.classList.remove("is-playing");
  });
}

// flip cards
// no hover on touch so tap to flip
const flipCards = document.querySelectorAll(".flip-card, .about-card");

if (flipCards.length && window.matchMedia("(hover: none)").matches) {
  flipCards.forEach((card) => {
    card.addEventListener("click", () => {
      const group = card.closest(".flip-grid, .about-cards") || card.parentElement;
      const wasFlipped = card.classList.contains("is-flipped");
      group.querySelectorAll(".flip-card, .about-card").forEach((c) => c.classList.remove("is-flipped"));
      card.classList.toggle("is-flipped", !wasFlipped);
    });
  });
}

// my role
const roleAccordionItems = document.querySelectorAll(".role-accordion-item");

roleAccordionItems.forEach((item) => {
  const trigger = item.querySelector(".role-accordion-trigger");

  trigger.addEventListener("click", () => {
    const wasOpen = item.classList.contains("is-open");

    roleAccordionItems.forEach((other) => {
      other.classList.remove("is-open");
      other.querySelector(".role-accordion-trigger").setAttribute("aria-expanded", "false");
    });

    item.classList.toggle("is-open", !wasOpen);
    trigger.setAttribute("aria-expanded", String(!wasOpen));
  });
});

// projects
// columns move at different speeds, desktop only
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
