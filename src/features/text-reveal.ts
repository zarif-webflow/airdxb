import {
  animate,
  type AnimationOptionsWithOverrides,
  type Easing,
  type MotionKeyframesDefinition,
  stagger,
} from 'motion';
import SplitType from 'split-type';

import { assertValue, fallback } from '@/utils/util';

export const selectors = {
  revealType: '[data-reveal-type]',
  revealParent: '[data-reveal-parent]',
  toggleScroll: '[data-toggle-scroll]',
  startScroll: '[data-start-scroll]',
  stopScroll: '[data-stop-scroll]',
  resetAnimation: '[data-reset-animation]',
} as const;

const revealTypeValuesArray = ['chars', 'words', 'lines'] as const;
export const revealTypeValuesSet: Set<string> = new Set(revealTypeValuesArray);
export type RevealTypeValue = (typeof revealTypeValuesArray)[number];

const animationTypeValuesArray = [
  'from-top',
  'from-bottom',
  'from-left-bottom',
  'fade-from-bottom-left',
] as const;
export const animationTypeValuesSet: Set<string> = new Set(animationTypeValuesArray);
export type AnimationTypeValue = (typeof animationTypeValuesArray)[number];

export type AnimationDataProps = {
  revealType: RevealTypeValue;
  animationType: AnimationTypeValue;
  duration: number;
  easing: MotionEaseType;
  delay: number;
  staggerDelay: number;
  fromX: string | undefined;
  fromY: string | undefined;
  fromOpacity: string | undefined;
  viewThreshold: number;
  resetAnimation: string | undefined;
};

export type AnimationDataKeys = keyof AnimationDataProps;
export const motionEaseArray: Easing[] = [
  'ease',
  'ease-in',
  'ease-in-out',
  'ease-out',
  'linear',
  'step-end',
  'step-start',
];
export type MotionEaseType = (typeof motionEaseArray)[number];
export const motionEaseSet: Set<MotionEaseType> = new Set(motionEaseArray);

export const getAnimationValues = (
  element: HTMLElement,
  defaultValues?: AnimationDataProps
): AnimationDataProps => {
  const {
    animationType,
    delay,
    duration,
    easing,
    revealType,
    staggerDelay,
    fromX,
    fromY,
    fromOpacity,
    viewThreshold,
    resetAnimation,
  } = element.dataset as Record<AnimationDataKeys, string | undefined>;

  const selectedAnimationType = assertValue(
    animationType,
    'Animation type not found or invalid!',
    (value) => value !== undefined && animationTypeValuesSet.has(value)
  ) as AnimationTypeValue;

  const selectedRevealType = fallback(
    revealType,
    defaultValues?.revealType ?? 'chars',
    (value) => value !== undefined && revealTypeValuesSet.has(value)
  ) as RevealTypeValue;

  const selectedEasing = fallback(
    easing,
    (defaultValues?.easing ?? 'ease') as string,
    (value) => value !== undefined && motionEaseSet.has(value as MotionEaseType)
  ) as MotionEaseType;

  const selectedDelay = fallback(Number.parseFloat(delay || ''), defaultValues?.delay ?? 0);
  const selectedViewThreshold = fallback(
    Number.parseFloat(viewThreshold || ''),
    defaultValues?.viewThreshold ?? 0.8
  );
  const selectedDuration = fallback(
    Number.parseFloat(duration || ''),
    defaultValues?.duration ?? 0.5
  );
  const selectedStaggerDelay = fallback(
    Number.parseFloat(staggerDelay || ''),
    defaultValues?.staggerDelay ?? 0.05
  );

  return {
    animationType: selectedAnimationType,
    revealType: selectedRevealType,
    delay: selectedDelay,
    duration: selectedDuration,
    easing: selectedEasing,
    staggerDelay: selectedStaggerDelay,
    fromX,
    fromY,
    fromOpacity,
    viewThreshold: selectedViewThreshold,
    resetAnimation,
  };
};

(async () => {
  const charRevealElements = document.querySelectorAll<HTMLElement>(selectors.revealType);
  const loaderDuration = Number.parseInt(document.body.dataset.loaderDuration ?? '');

  for (let i = 0; i < charRevealElements.length; i++) {
    const charRevealEl = charRevealElements[i]!;

    const charRevealParentEl = charRevealEl.closest<HTMLElement>(selectors.revealParent);
    const resetAnimationParent = charRevealEl.closest<HTMLElement>(selectors.resetAnimation);

    const {
      animationType,
      delay,
      duration,
      easing,
      revealType,
      staggerDelay,
      fromX,
      fromY,
      fromOpacity,
      viewThreshold,
    } = getAnimationValues(charRevealEl);

    const splitText = SplitType.create(charRevealEl, { types: 'words,chars' });

    const initialWordElements = splitText.words || [];
    const wordElements: HTMLElement[] = [];

    for (let j = 0; j < initialWordElements.length; j++) {
      const el = initialWordElements[j]!;

      const parentEl = document.createElement('span');
      const cloneEl = el.cloneNode(true) as HTMLElement;

      parentEl.classList.add('reveal-parent');
      parentEl.appendChild(cloneEl);
      el.replaceWith(parentEl);
      wordElements.push(cloneEl);
    }

    const charElements = Array.from(charRevealEl.querySelectorAll<HTMLElement>('.char'));

    const targetElements =
      (revealType === 'lines' || revealType === 'words' ? wordElements : charElements) || [];

    const motionTweenOverrides: AnimationOptionsWithOverrides = {
      delay: staggerDelay !== 0 ? stagger(staggerDelay, { start: delay }) : delay,
      easing,
      duration,
    };

    const getAnimationProps = () => {
      let animationsProps: MotionKeyframesDefinition = {};

      if (animationType === 'from-bottom') {
        animationsProps.y = '0%';
      }

      if (animationType === 'from-top') {
        animationsProps.y = ['-100%', '0%'];
      }

      if (animationType === 'fade-from-bottom-left') {
        animationsProps.y = '0%';
        animationsProps.x = '0%';
        animationsProps.opacity = '1';
      }

      return animationsProps;
    };

    const getInitialStateProps = () => {
      let tweenProps: MotionKeyframesDefinition = {};
      let overriddenProps: AnimationOptionsWithOverrides = { duration: 0, delay: 0 };

      if (animationType === 'from-bottom') {
        tweenProps.y = '100%';
      }

      if (animationType === 'from-top') {
        tweenProps.y = '-100%';
      }

      if (animationType === 'fade-from-bottom-left') {
        tweenProps.y = fromY || '30%';
        tweenProps.x = fromX || '-50px';
        tweenProps.opacity = fromOpacity || '0.05';
      }

      return { tweenProps, overriddenProps };
    };

    const initialStateProps = getInitialStateProps();
    const animateStateProps = getAnimationProps();

    animate(targetElements, initialStateProps.tweenProps, initialStateProps.overriddenProps);

    /* Remove initial invisibility */
    charRevealEl.dataset.initialized = '';

    let allLines: HTMLElement[][] = [];

    if (revealType === 'lines') {
      let currentLineTopRect = 0;
      let currentLineWords: HTMLElement[] = [];
      const resOb = new ResizeObserver((entries) => {
        for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
          for (let k = 0; k < wordElements.length; k++) {
            const wordElement = wordElements[k]!;
            const wordTopRect = wordElement.getBoundingClientRect().top;

            if (wordTopRect === currentLineTopRect) {
              currentLineWords.push(wordElement);
            } else {
              currentLineTopRect = wordTopRect;
              currentLineWords.length > 0 && allLines.push(currentLineWords);
              currentLineWords = [wordElement];
            }
          }
          allLines.push(currentLineWords);
        }
      });

      resOb.observe(charRevealEl);
    }

    const shouldAnimationReset = resetAnimationParent !== null;

    const targetObserverElement = charRevealParentEl || charRevealEl;
    const isRunningMap: Map<string, boolean> = new Map();
    let isRunningMulti = false;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (revealType === 'lines' && allLines.length > 0) {
              for (let i = 0; i < allLines.length; i++) {
                const line = allLines[i]!;
                for (let j = 0; j < line.length; j++) {
                  const id = `${i}${j}`;

                  if (isRunningMap.get(id)) continue;

                  isRunningMap.set(id, true);

                  const delayPropValue = delay || 0;
                  const staggerPropValue = i === 0 && j === 0 ? 0 : staggerDelay || 0;

                  const finalDelay = delayPropValue + i * staggerPropValue;

                  const word = line[j]!;

                  animate(word, animateStateProps, {
                    ...motionTweenOverrides,
                    delay: finalDelay,
                  }).finished.then(() => {
                    isRunningMap.delete(id);
                  });
                }
              }
            } else {
              if (isRunningMulti) return;
              isRunningMulti = true;
              animate(targetElements, animateStateProps, { ...motionTweenOverrides }).finished.then(
                () => {
                  isRunningMulti = false;
                }
              );
            }

            if (!shouldAnimationReset) {
              revealObserver.unobserve(entry.target);
            }
          }
        }
      },
      {
        threshold: viewThreshold,
      }
    );

    let resetObserver: IntersectionObserver | undefined = undefined;

    if (shouldAnimationReset) {
      resetObserver = new IntersectionObserver(
        (entries) => {
          // eslint-disable-next-line
          for (const entry of entries) {
            if (entry.isIntersecting) return;

            animate(
              targetElements,
              initialStateProps.tweenProps,
              initialStateProps.overriddenProps
            );
          }
        },
        { threshold: 0 }
      );
    }

    if (!Number.isNaN(loaderDuration)) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          revealObserver.observe(targetObserverElement);
          resetObserver?.observe(targetObserverElement);
        }, loaderDuration);
      });
    } else {
      revealObserver.observe(targetObserverElement);
      resetObserver?.observe(targetObserverElement);
    }
  }
})();
