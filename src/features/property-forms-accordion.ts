import { getGsap, getHtmlElement, getMultipleHtmlElements } from "@taj-wf/utils";

const scrollIntoMiddleOfAnElement = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Calculate the current position of the element's center
  const elementCenterY = rect.top + rect.height / 2;
  const elementCenterX = rect.left + rect.width / 2;

  // Calculate the desired position (center of viewport)
  const viewportCenterY = viewportHeight / 2;
  const viewportCenterX = viewportWidth / 2;

  // Calculate how much we need to scroll
  const scrollY = elementCenterY - viewportCenterY;
  const scrollX = elementCenterX - viewportCenterX;

  window.scrollBy({
    top: scrollY,
    left: scrollX,
    behavior: "smooth",
  });
};

const initPropertyFormsAccordion = () => {
  const [gsap] = getGsap();

  if (!gsap) return;

  const listingFormSection = getHtmlElement({
    selector: "[accordion-form=listing-section]",
  });
  const bookingFormSection = getHtmlElement({
    selector: "[accordion-form=booking-section]",
  });

  const listingFormContent = getHtmlElement({ selector: "[accordion-form=listing]", log: "error" });
  const bookingFormContent = getHtmlElement({ selector: "[accordion-form=booking]", log: "error" });

  if (!listingFormContent || !bookingFormContent) return;

  const listingFormTogglers = getMultipleHtmlElements({
    selector: "[accordion-form=listing-toggle]",
    log: "error",
  });
  const bookingFormTogglers = getMultipleHtmlElements({
    selector: "[accordion-form=booking-toggle]",
    log: "error",
  });

  if (!listingFormTogglers || !bookingFormTogglers) return;

  const listingArrow = getHtmlElement({ selector: "[accordion-form=listing-arrow]" });
  const bookingArrow = getHtmlElement({ selector: "[accordion-form=booking-arrow]" });

  for (const listingToggler of listingFormTogglers) {
    listingToggler.addEventListener("click", () => {
      if (listingToggler.hasAttribute("scroll-to-form")) {
        scrollIntoMiddleOfAnElement(listingFormSection || listingFormContent);
      }

      bookingFormContent.style.overflowY = "clip";
      gsap.to(bookingFormContent, { height: 0, duration: 0.4 });
      gsap.to(listingFormContent, {
        height: "auto",
        duration: 0.4,
        onComplete: () => {
          listingFormContent.style.overflowY = "visible";
        },
      });
      gsap.to(bookingArrow, { rotate: 0, duration: 0.15 });
      gsap.to(listingArrow, { rotate: -90, duration: 0.15 });
    });
  }

  for (const bookingToggler of bookingFormTogglers) {
    bookingToggler.addEventListener("click", () => {
      if (bookingToggler.hasAttribute("scroll-to-form")) {
        scrollIntoMiddleOfAnElement(bookingFormSection || bookingFormContent);
      }

      listingFormContent.style.overflowY = "clip";
      gsap.to(listingFormContent, { height: 0, duration: 0.4 });
      gsap.to(bookingFormContent, {
        height: "auto",
        duration: 0.4,
        onComplete: () => {
          bookingFormContent.style.overflowY = "visible";
        },
      });
      gsap.to(bookingArrow, { rotate: -90, duration: 0.15 });
      gsap.to(listingArrow, { rotate: 0, duration: 0.15 });
    });
  }
};

initPropertyFormsAccordion();
