const navLinks = Array.from(document.querySelectorAll(".primary-nav a[href^='#']"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveSection(id) {
  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updateActiveSection() {
  const headerOffset = document.querySelector(".site-header").offsetHeight + 80;
  let activeId = sections[0]?.id;

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= headerOffset) {
      activeId = section.id;
    }
  });

  if (activeId) {
    setActiveSection(activeId);
  }
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href").slice(1);
    setActiveSection(targetId);
  });
});

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateActiveSection();
      ticking = false;
    });
    ticking = true;
  }
});

updateActiveSection();
