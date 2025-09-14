import { preventBodyScroll } from "@zag-js/remove-scroll";
import Lenis from "lenis";

// Extend Window interface to include getLenis function
declare global {
  interface Window {
    getLenis: () => Lenis | null;
  }
}

const selectors = {
  toggleScroll: "[data-toggle-scroll]",
  startScroll: "[data-start-scroll]",
  stopScroll: "[data-stop-scroll]",
} as const;

const init = () => {
  const noSmoothScroll = document.body.dataset.noSmoothScroll !== undefined;

  const activateLenis = () => {
    return noSmoothScroll
      ? null
      : new Lenis({
          lerp: 0.1,
          wheelMultiplier: 0.7,
          gestureOrientation: "vertical",
        });
  };

  let lenis = activateLenis();

  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  const scrollTogglers = [...document.querySelectorAll(selectors.toggleScroll)] as HTMLElement[];
  const scrollStartTriggers = [
    ...document.querySelectorAll(selectors.startScroll),
  ] as HTMLElement[];
  const scrollStopTriggers = [...document.querySelectorAll(selectors.stopScroll)] as HTMLElement[];

  let resetScroll: (() => void) | undefined = undefined;

  for (let i = 0; i < scrollTogglers.length; i++) {
    const scrollToggleElement = scrollTogglers[i];

    scrollToggleElement.addEventListener("click", () => {
      if (scrollToggleElement.classList.contains("stop-scroll")) {
        resetScroll?.();
        lenis = activateLenis();
        scrollToggleElement.classList.remove("stop-scroll");
        return;
      }
      resetScroll = preventBodyScroll();
      lenis?.destroy();
      scrollToggleElement.classList.add("stop-scroll");
    });
  }

  for (const startTrigger of scrollStartTriggers) {
    startTrigger.addEventListener("click", () => {
      lenis = activateLenis();
      resetScroll?.();
    });
  }

  for (const stopTrigger of scrollStopTriggers) {
    stopTrigger.addEventListener("click", () => {
      lenis?.destroy();
      resetScroll = preventBodyScroll();
    });
  }

  // Expose Lenis instance to window
  window.getLenis = () => lenis;
};

init();
