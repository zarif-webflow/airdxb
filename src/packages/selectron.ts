import { getAssertedHtmlElement, getAssertedHtmlElements, setStyle } from '@/utils/util';
import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { trackInteractOutside } from '@zag-js/interact-outside';

const generatedUids: Set<string> = new Set();

const generateId = () => {
  while (true) {
    const uid = Math.random().toString(36).substring(2, 8);
    if (generatedUids.has(uid)) continue;
    return uid;
  }
};

export const setupSelectron = (rootElement: HTMLElement) => {
  const fragment = document.createDocumentFragment();
  const trigger = getAssertedHtmlElement('[data-st-trigger]', rootElement);
  const triggerValue = getAssertedHtmlElement('[data-st-value]', trigger);
  const content = getAssertedHtmlElement('[data-st-content]', rootElement);
  const viewport = getAssertedHtmlElement('[data-st-viewport]', rootElement);

  let isOpen: boolean = false;
  let defaultOptionIndex: number | undefined = undefined;
  let selectedOptionIndex: number | undefined = undefined;
  let highlightedOptionIndex: number | undefined = undefined;

  let keyboardNavigationCallback: ((e: KeyboardEvent) => void) | undefined = undefined;
  let cleanupAutoUpdate: (() => void) | undefined = undefined;
  let cleanupOutsideInteraction: (() => void) | undefined = undefined;

  const elementIds: {
    rootElement: string;
    trigger: string;
    content: string;
    viewport: string;
    id: string;
  } = (() => {
    const id = `st--${generateId()}`;
    let rootId = rootElement.id;

    if (rootId === '') {
      rootId = id;
      rootElement.id = rootId;
    }

    const elementIds = {
      id,
      content: `${id}--content`,
      trigger: `${id}--trigger`,
      viewport: `${id}--viewport`,
      rootElement: rootId,
    };

    content.id = elementIds.content;
    trigger.id = elementIds.trigger;
    viewport.id = elementIds.viewport;

    return elementIds;
  })();

  const optionItems = (() => {
    let isDefaultSelected = false;
    const optionItems: { element: HTMLElement; value: string }[] = [];

    const optionElements = getAssertedHtmlElements('[data-st-option]', rootElement);

    for (let i = 0; i < optionElements.length; i++) {
      const element = optionElements[i]!;

      const value = element.getAttribute('data-value') ?? element.textContent?.trim();

      if (value === undefined)
        throw new Error('Option element must have a value or a text content!');

      element.setAttribute('data-value', value);
      element.setAttribute('id', `${elementIds.id}--option-${i}`);

      const isDefault = element.hasAttribute('selected') && !isDefaultSelected;

      optionItems.push({ element, value });

      if (isDefault) {
        isDefaultSelected = true;
        defaultOptionIndex = i;
        triggerValue.textContent = element.textContent?.trim() || null;
        triggerValue.setAttribute('data-selected', '');
      }
    }

    return optionItems;
  })();

  const nativeSelect: HTMLSelectElement = (() => {
    const nativeSelect = document.createElement('select');

    const selectName = rootElement.getAttribute('data-name');
    selectName && (nativeSelect.name = selectName);

    const dataAria = rootElement.getAttribute('data-aria');

    if (dataAria === 'inert' || !rootElement.hasAttribute('data-aria'))
      nativeSelect.setAttribute('inert', '');

    if (dataAria === 'hidden') nativeSelect.setAttribute('aria-hidden', 'true');

    nativeSelect.tabIndex = -1;

    if (rootElement.hasAttribute('data-required')) {
      nativeSelect.required = true;
    }

    const optionsFragment = document.createDocumentFragment();

    let wasDefaultSelected = false;

    for (let i = 0; i < optionItems.length; i++) {
      const { value: optionValue } = optionItems[i]!;
      const optionElement = document.createElement('option');

      optionElement.value = optionValue;
      optionElement.textContent = optionValue;

      if (i === defaultOptionIndex && !wasDefaultSelected) {
        optionElement.setAttribute('selected', '');
        wasDefaultSelected = true;
      }

      optionsFragment.appendChild(optionElement);
    }

    nativeSelect.appendChild(optionsFragment);

    setStyle(rootElement, { position: 'relative' });

    setStyle(nativeSelect, {
      width: '0px',
      height: '0px',
      padding: '0px',
      margin: '0px',
      overflow: 'hidden',
      position: 'absolute',
      bottom: '0px',
      left: '50%',
      transform: 'translateX(-50%)',
      clip: 'rect(0px, 0px, 0px, 0px)',
      'white-space': 'nowrap',
      'overflow-wrap': 'normal',
    });

    !wasDefaultSelected && (nativeSelect.value = '');

    rootElement.appendChild(nativeSelect);

    return nativeSelect;
  })();

  const dehighlightOptions = () => {
    if (highlightedOptionIndex !== undefined) {
      const prevHighlightedOption = optionItems[highlightedOptionIndex]!;

      prevHighlightedOption.element.classList.remove('focused', 'hovered');
      prevHighlightedOption.element.removeAttribute('data-focused');
      prevHighlightedOption.element.removeAttribute('data-hovered');
      prevHighlightedOption.element.blur();
    }

    highlightedOptionIndex = undefined;
    content.removeAttribute('aria-activedescendant');
  };

  const highlightOption = (optionIndex: number, type: 'focus' | 'hover' = 'hover') => {
    const optionElement = optionItems[optionIndex]!.element;

    dehighlightOptions();

    if (type === 'focus') {
      optionElement.classList.add('focused');
      optionElement.setAttribute('data-focused', 'true');
      optionElement.focus();
    }

    if (type === 'hover') {
      optionElement.classList.add('hovered');
      optionElement.setAttribute('data-hovered', 'true');
    }

    const optionId = optionElement.getAttribute('id');

    if (optionId !== null) content.setAttribute('aria-activedescendant', optionId);

    highlightedOptionIndex = optionIndex;
  };

  const removeSelection = () => {
    for (const { value, element: optionElement } of optionItems) {
      triggerValue.removeAttribute('data-selected');

      if (value === '') {
        triggerValue.textContent = optionElement.textContent;
        optionElement.dataset.selected = 'false';
        optionElement.ariaSelected = 'false';
        continue;
      }

      optionElement.dataset.selected = 'false';
      optionElement.ariaSelected = 'false';
      optionElement.classList.remove('selected');
    }
    nativeSelect.value = '';
  };

  const setModalPosition = () => {
    computePosition(trigger, content, {
      placement: 'bottom-start',
      middleware: [
        offset(),
        flip(),
        shift(),
        size({
          apply: ({ rects }) => {
            setStyle(content, { 'min-width': `${rects.reference.width}px` });
          },
        }),
      ],
    }).then(({ x, y }) => {
      setStyle(content, { left: `${x}px`, top: `${y}px` });
    });
  };

  const closeModal = () => {
    if (!isOpen) return;

    fragment.appendChild(content);
    isOpen = false;
    trigger.ariaExpanded = 'false';

    cleanupAutoUpdate?.();
    cleanupOutsideInteraction?.();

    keyboardNavigationCallback &&
      document.removeEventListener('keydown', keyboardNavigationCallback);
  };

  const openModal = () => {
    if (isOpen) return;

    document.body.appendChild(content);
    isOpen = true;
    trigger.ariaExpanded = 'true';

    if (selectedOptionIndex !== undefined) {
      highlightOption(selectedOptionIndex);
    }

    setModalPosition();

    cleanupAutoUpdate = autoUpdate(trigger, content, setModalPosition);
    cleanupOutsideInteraction = trackInteractOutside(content, {
      onPointerDownOutside: closeModal,
      onInteractOutside: closeModal,
      onFocusOutside: closeModal,
      exclude: (target) => trigger.isSameNode(target) || trigger.contains(target),
    });

    keyboardNavigationCallback = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();

        if (highlightedOptionIndex === undefined) return;

        selectOption(highlightedOptionIndex);
        closeModal();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();

        highlightOption(
          highlightedOptionIndex === undefined || highlightedOptionIndex >= optionItems.length - 1
            ? 0
            : highlightedOptionIndex + 1,
          'focus'
        );
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();

        highlightOption(
          highlightedOptionIndex === undefined || highlightedOptionIndex <= 0
            ? optionItems.length - 1
            : highlightedOptionIndex - 1,
          'focus'
        );
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    };

    document.addEventListener('keydown', keyboardNavigationCallback);
  };

  const selectOption = (optionIndex: number) => {
    const optionElement = optionItems[optionIndex]!.element;

    removeSelection();

    selectedOptionIndex = optionIndex;
    highlightOption(optionIndex, 'hover');

    const value = optionElement.getAttribute('data-value');

    if (value === null) {
      throw new Error('Option element must have a value!');
    }

    if (value) {
      nativeSelect.value = value;
      triggerValue.setAttribute('data-selected', '');
    } else {
      nativeSelect.removeAttribute('value');
      triggerValue.removeAttribute('data-selected');
    }

    triggerValue.textContent = optionElement.textContent?.trim() || null;

    optionElement.ariaSelected = 'true';
    optionElement.dataset.selected = 'true';
    optionElement.classList.add('selected');

    closeModal();
  };

  const initialSetup = () => {
    // Trigger
    trigger.setAttribute('type', 'button');
    trigger.tagName !== 'BUTTON' && (trigger.role = 'button');
    trigger.ariaHasPopup = 'listbox';
    trigger.ariaExpanded = 'false';
    trigger.setAttribute('aria-controls', elementIds.content);

    trigger.addEventListener('click', () => {
      openModal();
    });

    // Listbox
    fragment.append(content);
    content.role = 'listbox';
    content.tabIndex = 0;
    content.setAttribute('aria-labelledby', elementIds.trigger);
    content.ariaOrientation = 'vertical';

    if (rootElement.hasAttribute('data-required')) {
      content.ariaRequired = 'true';
    }

    setStyle(content, {
      position: 'absolute',
      'min-width': `var(--st-content-min-w)`,
      left: `var(--st-content-left)`,
      top: `var(--st-content-top)`,
    });

    // Viewport
    viewport.role = 'presentation';

    // Options
    for (let i = 0; i < optionItems.length; i++) {
      const optionItem = optionItems[i]!;
      optionItem.element.role = 'option';
      optionItem.element.tabIndex = -1;

      optionItem.element.ariaSelected = i === defaultOptionIndex ? 'true' : 'false';
      optionItem.element.dataset.selected = i === defaultOptionIndex ? 'true' : 'false';

      const svgs = optionItem.element.querySelectorAll('svg');

      svgs.forEach((svg) => {
        svg.ariaHidden = 'true';
      });

      optionItem.element.addEventListener('click', () => {
        selectOption(i);
      });

      optionItem.element.addEventListener('mouseenter', () => {
        highlightOption(i);
      });
      optionItem.element.addEventListener('mouseleave', () => {
        dehighlightOptions();
      });
    }
  };

  initialSetup();
};
