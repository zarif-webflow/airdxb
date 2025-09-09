import { animate } from "motion";

import { assertValue } from "@/utils/util";

const form = assertValue(
  document.querySelector<HTMLFormElement>("form[data-calculator-form]"),
  `form element([data-calculator-form]) was not found!`
);
const step1Element = assertValue(
  form.querySelector<HTMLDivElement>('[data-form-step="1"]'),
  `form step 1 element([data-form-step="1"]) was not found!`
);
const nextButton = assertValue(
  form.querySelector<HTMLButtonElement>("[data-next-button]"),
  "Form next button ([data-next-button]) was not found"
);
const step2Element = assertValue(
  form.querySelector<HTMLDivElement>('[data-form-step="2"]'),
  `form step 2 element([data-form-step="2"]) was not found!`
);
const prevButton = assertValue(
  form.querySelector<HTMLButtonElement>("button[data-prev-button]"),
  "Form prev button ([data-prev-button]) was not found"
);
const addressInputElement = assertValue(
  form.querySelector<HTMLInputElement>("[data-address-input]"),
  "Address input element ([data-address-input]) was not found"
);
const bedroomsSelectElement = assertValue(
  form.querySelector<HTMLSelectElement>('select[name="bedrooms"]'),
  "Bedroom input element ([data-address-input]) was not found"
);

const animateNext = async () => {
  await animate(step1Element, { opacity: 0, transform: "translateX(-100%)" }, { duration: 0.4 })
    .finished;

  step1Element.classList.add("is--hidden");

  await animate(step2Element, { opacity: 0, transform: "translateX(100%)" }, { duration: 0 })
    .finished;

  step2Element.classList.remove("is--hidden");

  await animate(step2Element, { opacity: 1, transform: "translateX(0%)" }, { duration: 0.4 })
    .finished;
};

const animatePrev = async () => {
  await animate(step2Element, { opacity: 0, transform: "translateX(100%)" }, { duration: 0.4 })
    .finished;

  step2Element.classList.add("is--hidden");

  await animate(step1Element, { opacity: 0, transform: "translateX(-100%)" }, { duration: 0 })
    .finished;

  step1Element.classList.remove("is--hidden");

  await animate(step1Element, { opacity: 1, transform: "translateX(0%)" }, { duration: 0.4 })
    .finished;
};

nextButton.addEventListener("click", () => {
  for (const inputEl of [addressInputElement, bedroomsSelectElement]) {
    if (inputEl.checkValidity()) continue;
    inputEl.reportValidity();
    return;
  }

  animateNext();
});

prevButton.addEventListener("click", () => {
  animatePrev();
});

const addHubspotFieldName = () => {
  const selectRoot = form.querySelector<HTMLElement>("[data-st-root]");

  if (!selectRoot) {
    console.error("form[data-calculator-form] [data-st-root] wasn't found!");
    return;
  }

  const hubSpotFieldName = selectRoot.dataset.wfhsfieldname;

  if (hubSpotFieldName !== undefined) {
    selectRoot.removeAttribute("data-wfhsfieldname");
    bedroomsSelectElement.setAttribute("data-wfhsfieldname", hubSpotFieldName);
  }
};

addHubspotFieldName();
