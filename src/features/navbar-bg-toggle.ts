import { fallback } from "@/utils/util";

const initNavbarBgToggle = () => {
  const navbar = document.querySelector<HTMLDivElement>("[data-navbar-bg]");

  if (!navbar) return;

  const toggleBgPosition = Number.parseInt(fallback(navbar.dataset.toggleBgPosition, "100"));

  window.addEventListener("scroll", () => {
    const position = window.scrollY;

    if (position > toggleBgPosition) {
      navbar.classList.add("below--top");
    } else {
      navbar.classList.remove("below--top");
    }
  });
};

initNavbarBgToggle();
