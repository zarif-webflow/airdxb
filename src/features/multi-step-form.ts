import { animate } from 'motion';

import { assertValue } from '@/utils/util';

const form = assertValue(document.querySelector<HTMLFormElement>('form[data-calculator-form]'));
const step1Element = assertValue(form.querySelector<HTMLDivElement>('[data-form-step="1"]'));
const nextButton = assertValue(
  step1Element.querySelector<HTMLButtonElement>('button[data-next-button]')
);
const step2Element = assertValue(form.querySelector<HTMLDivElement>('[data-form-step="2"]'));
const prevButton = assertValue(
  step2Element.querySelector<HTMLButtonElement>('button[data-prev-button]')
);

const step1InputElements = [
  assertValue(form.querySelector<HTMLInputElement>('[data-address-input]')),
  assertValue(form.querySelector<HTMLSelectElement>('[data-bedrooms-input]')),
];

const animateNext = async () => {
  await animate(step1Element, { opacity: 0, transform: 'translateX(-100%)' }, { duration: 0.4 })
    .finished;

  step1Element.classList.add('is--hidden');

  await animate(step2Element, { opacity: 0, transform: 'translateX(100%)' }, { duration: 0 })
    .finished;

  step2Element.classList.remove('is--hidden');

  await animate(step2Element, { opacity: 1, transform: 'translateX(0%)' }, { duration: 0.4 })
    .finished;
};

const animatePrev = async () => {
  await animate(step2Element, { opacity: 0, transform: 'translateX(100%)' }, { duration: 0.4 })
    .finished;

  step2Element.classList.add('is--hidden');

  await animate(step1Element, { opacity: 0, transform: 'translateX(-100%)' }, { duration: 0 })
    .finished;

  step1Element.classList.remove('is--hidden');

  await animate(step1Element, { opacity: 1, transform: 'translateX(0%)' }, { duration: 0.4 })
    .finished;
};

nextButton.addEventListener('click', () => {
  for (const inputEl of step1InputElements) {
    if (inputEl.checkValidity()) continue;
    inputEl.reportValidity();
    return;
  }

  animateNext();
});

prevButton.addEventListener('click', () => {
  animatePrev();
});
