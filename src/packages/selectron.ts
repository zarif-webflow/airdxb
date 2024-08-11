import { getAssertedHtmlElement, getAssertedHtmlElements, setStyle } from '@/utils/util';

const generatedUids: Set<string> = new Set();

export class Selectron {
  private rootElement: HTMLElement;
  private nativeSelect: HTMLSelectElement;
  private trigger: HTMLElement;
  private triggerValue: HTMLElement;
  private content: HTMLElement;
  private viewport: HTMLElement;
  private fragment: DocumentFragment;
  private optionItems: { element: HTMLElement; value: string }[];
  private elementIds: {
    rootElement: string;
    trigger: string;
    content: string;
    viewport: string;
    id: string;
  };
  private defaultOptionIndex: number | undefined = undefined;
  private selectedOptionIndex: number | undefined = undefined;
  private highlightedOptionIndex: number | undefined = undefined;
  private isOpen: boolean = false;
  private position: 'top' | 'bottom' | undefined = undefined;
  private triggerRect: {
    offsetTop: number;
    offsetLeft: number;
    width: number;
    height: number;
  } = { offsetTop: 0, offsetLeft: 0, width: 0, height: 0 };
  private contentRect: {
    offsetTop: number;
    offsetLeft: number;
    width: number;
    height: number;
  } = { offsetTop: 0, offsetLeft: 0, width: 0, height: 0 };
  private clickOutsideCallback: (e: MouseEvent) => void;
  private keyboardNavigationCallback: (e: KeyboardEvent) => void;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.fragment = document.createDocumentFragment();
    this.trigger = getAssertedHtmlElement('[data-st-trigger]', this.rootElement);
    this.triggerValue = getAssertedHtmlElement('[data-st-value]', this.trigger);
    this.content = getAssertedHtmlElement('[data-st-content]', this.rootElement);

    this.viewport = getAssertedHtmlElement('[data-st-viewport]', this.rootElement);
    this.elementIds = this.generateElementIds();
    this.optionItems = this.getOptionItems();
    this.nativeSelect = this.setupNativeSelect();

    this.setElementRects();

    // remove main listbox from dom
    this.fragment.appendChild(this.content);

    this.initialSetup();

    this.clickOutsideCallback = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        this.content.isSameNode(target) ||
        this.content.contains(target) ||
        this.trigger.isSameNode(target) ||
        this.trigger.contains(target)
      )
        return;

      this.closeModal();
    };

    this.keyboardNavigationCallback = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();

        if (this.highlightedOptionIndex === undefined) return;

        this.selectOption(this.highlightedOptionIndex);
        this.closeModal();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();

        this.highlightOption(
          this.highlightedOptionIndex === undefined ||
            this.highlightedOptionIndex >= this.optionItems.length - 1
            ? 0
            : this.highlightedOptionIndex + 1,
          'focus'
        );
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();

        this.highlightOption(
          this.highlightedOptionIndex === undefined || this.highlightedOptionIndex <= 0
            ? this.optionItems.length - 1
            : this.highlightedOptionIndex - 1,
          'focus'
        );
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeModal();
      }
    };

    this.scrollAwareness();
    this.resizeAwareness();
  }

  private generateId() {
    while (true) {
      const uid = Math.random().toString(36).substring(2, 8);
      if (generatedUids.has(uid)) continue;
      return uid;
    }
  }

  private generateElementIds(): typeof this.elementIds {
    const id = `st--${this.generateId()}`;
    let rootId = this.rootElement.id;

    if (rootId === '') {
      rootId = id;
      this.rootElement.id = rootId;
    }

    const elementIds = {
      id,
      content: `${id}--content`,
      trigger: `${id}--trigger`,
      viewport: `${id}--viewport`,
      rootElement: rootId,
    };

    this.content.id = elementIds.content;
    this.trigger.id = elementIds.trigger;
    this.viewport.id = elementIds.viewport;

    return elementIds;
  }

  private getOptionItems() {
    let isDefaultSelected = false;
    const optionItems: typeof this.optionItems = [];

    const optionElements = getAssertedHtmlElements('[data-st-option]', this.rootElement);

    for (let i = 0; i < optionElements.length; i++) {
      const element = optionElements[i]!;

      const value = element.getAttribute('value') ?? element.textContent?.trim();

      if (value === undefined)
        throw new Error('Option element must have a value or a text content!');

      element.setAttribute('value', value);
      element.setAttribute('id', `${this.elementIds.id}--option-${i}`);

      const isDefault = element.hasAttribute('selected') && !isDefaultSelected;

      optionItems.push({ element, value });

      if (isDefault) {
        isDefaultSelected = true;
        this.defaultOptionIndex = i;
        this.triggerValue.textContent = element.textContent?.trim() || null;
        this.triggerValue.setAttribute('data-selected', '');
      }
    }

    return optionItems;
  }

  private setupNativeSelect() {
    const nativeSelect = document.createElement('select');

    const selectName = this.rootElement.getAttribute('name');
    selectName && (nativeSelect.name = selectName);

    nativeSelect.setAttribute('inert', '');
    nativeSelect.tabIndex = -1;

    if (this.rootElement.hasAttribute('required')) {
      nativeSelect.required = true;
    }

    const optionsFragment = document.createDocumentFragment();

    let wasDefaultSelected = false;

    for (let i = 0; i < this.optionItems.length; i++) {
      const { value: optionValue } = this.optionItems[i]!;
      const optionElement = document.createElement('option');

      optionElement.value = optionValue;
      optionElement.textContent = optionValue;

      if (i === this.defaultOptionIndex && !wasDefaultSelected) {
        optionElement.setAttribute('selected', '');
        wasDefaultSelected = true;
      }

      optionsFragment.appendChild(optionElement);
    }

    nativeSelect.appendChild(optionsFragment);

    setStyle(this.rootElement, { position: 'relative' });

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

    this.rootElement.appendChild(nativeSelect);

    return nativeSelect;
  }

  private initialSetup() {
    // Trigger
    this.trigger.setAttribute('type', 'button');
    this.trigger.tagName !== 'BUTTON' && (this.trigger.role = 'button');
    this.trigger.ariaHasPopup = 'listbox';
    this.trigger.ariaExpanded = 'false';
    this.trigger.setAttribute('aria-controls', this.elementIds.content);

    this.trigger.addEventListener('click', () => {
      this.openModal();
    });

    // Listbox
    this.content.role = 'listbox';
    this.content.tabIndex = 0;
    this.content.setAttribute('aria-labelledby', this.elementIds.trigger);
    this.content.ariaOrientation = 'vertical';

    if (this.rootElement.hasAttribute('required')) {
      this.content.ariaRequired = 'true';
    }

    setStyle(this.content, {
      position: 'absolute',
      'min-width': `var(--st-content-min-w)`,
      left: `var(--st-content-left)`,
      top: `var(--st-content-top)`,
      '--st-x': '0px',
      '--st-y': '0px',
      transform: 'translateX(var(--st-x)) translateY(var(--st-y))',
    });

    // Viewport
    this.viewport.role = 'presentation';

    // Options
    for (let i = 0; i < this.optionItems.length; i++) {
      const optionItem = this.optionItems[i]!;
      optionItem.element.role = 'option';
      optionItem.element.tabIndex = -1;

      optionItem.element.ariaSelected = i === this.defaultOptionIndex ? 'true' : 'false';
      optionItem.element.dataset.selected = i === this.defaultOptionIndex ? 'true' : 'false';

      const svgs = optionItem.element.querySelectorAll('svg');

      svgs.forEach((svg) => {
        svg.ariaHidden = 'true';
      });

      optionItem.element.addEventListener('click', () => {
        this.selectOption(i);
      });

      optionItem.element.addEventListener('mouseenter', () => {
        this.highlightOption(i);
      });
      optionItem.element.addEventListener('mouseleave', () => {
        this.dehighlightOptions();
      });
    }
  }

  private removeSelection() {
    for (const { value, element: optionElement } of this.optionItems) {
      this.triggerValue.removeAttribute('data-selected');

      if (value === '') {
        this.triggerValue.textContent = optionElement.textContent;
        optionElement.dataset.selected = 'false';
        optionElement.ariaSelected = 'false';
        continue;
      }

      optionElement.dataset.selected = 'false';
      optionElement.ariaSelected = 'false';
      optionElement.classList.remove('selected');
    }
    this.nativeSelect.value = '';
  }

  private selectOption(optionIndex: number) {
    const optionElement = this.optionItems[optionIndex]!.element;

    this.removeSelection();

    this.selectedOptionIndex = optionIndex;
    this.highlightOption(optionIndex, 'hover');

    const value = optionElement.getAttribute('value');

    if (value === null) {
      throw new Error('Option element must have a value!');
    }

    if (value) {
      this.nativeSelect.value = value;
      this.triggerValue.setAttribute('data-selected', '');
    } else {
      this.nativeSelect.removeAttribute('value');
      this.triggerValue.removeAttribute('data-selected');
    }

    this.triggerValue.textContent = optionElement.textContent?.trim() || null;

    optionElement.ariaSelected = 'true';
    optionElement.dataset.selected = 'true';
    optionElement.classList.add('selected');

    this.closeModal();
  }

  private dehighlightOptions() {
    if (this.highlightedOptionIndex !== undefined) {
      const prevHighlightedOption = this.optionItems[this.highlightedOptionIndex]!;

      prevHighlightedOption.element.classList.remove('focused', 'hovered');
      prevHighlightedOption.element.removeAttribute('data-focused');
      prevHighlightedOption.element.removeAttribute('data-hovered');
      prevHighlightedOption.element.blur();
    }

    this.highlightedOptionIndex = undefined;
    this.content.removeAttribute('aria-activedescendant');
  }

  private highlightOption(optionIndex: number, type: 'focus' | 'hover' = 'hover') {
    const optionElement = this.optionItems[optionIndex]!.element;

    this.dehighlightOptions();

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

    if (optionId !== null) this.content.setAttribute('aria-activedescendant', optionId);

    this.highlightedOptionIndex = optionIndex;
  }

  private closeModal() {
    this.fragment.appendChild(this.content);
    this.isOpen = false;
    this.trigger.ariaExpanded = 'false';
    document.body.removeEventListener('click', this.clickOutsideCallback);
    document.removeEventListener('keydown', this.keyboardNavigationCallback);
  }

  private openModal() {
    document.body.appendChild(this.content);
    this.isOpen = true;
    this.trigger.ariaExpanded = 'true';

    if (this.selectedOptionIndex !== undefined) {
      this.highlightOption(this.selectedOptionIndex);
    }

    this.setModalPosition();

    document.body.addEventListener('click', this.clickOutsideCallback);
    document.addEventListener('keydown', this.keyboardNavigationCallback);
  }

  private setElementRects() {
    const triggerRect = this.trigger.getBoundingClientRect();
    const contentRect = this.content.getBoundingClientRect();

    this.triggerRect.offsetTop = triggerRect.top + globalThis.scrollY;
    this.triggerRect.offsetLeft = triggerRect.left + globalThis.scrollX;
    this.triggerRect.width = triggerRect.width;
    this.triggerRect.height = triggerRect.height;

    this.contentRect.offsetTop = triggerRect.top + globalThis.scrollY + this.triggerRect.height;
    this.contentRect.offsetLeft = triggerRect.left + globalThis.scrollX;
    this.contentRect.width = contentRect.width;
    this.contentRect.height = contentRect.height;

    setStyle(this.content, {
      '--st-content-min-w': `${Math.max(this.contentRect.width, this.triggerRect.width)}px`,
      '--st-content-left': `${this.contentRect.offsetLeft}px`,
    });
  }

  private setModalPosition() {
    const { offsetTop, height: contentHeight } = this.contentRect;
    const { height: triggerHeight, offsetTop: triggerOffsetTop } = this.triggerRect;

    const contentWindowTop =
      this.trigger.getBoundingClientRect().top + triggerHeight + contentHeight + 80;

    const targetPosition: NonNullable<typeof this.position> =
      window.innerHeight > contentWindowTop ? 'bottom' : 'top';

    this.position = targetPosition;

    if (targetPosition === 'bottom') {
      setStyle(this.content, {
        '--st-content-top': `${offsetTop}px`,
        '--st-y': '4px',
      });
    } else {
      setStyle(this.content, {
        '--st-content-top': `${triggerOffsetTop - contentHeight}px`,
        '--st-y': '-4px',
      });
    }
  }

  private scrollAwareness() {
    const onScroll = () => {
      if (!this.isOpen) return;
      this.setModalPosition();
    };

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.addEventListener('scroll', onScroll);
            return;
          }
          window.removeEventListener('scroll', onScroll);
        }
      },
      { root: null, threshold: 0 }
    );

    scrollObserver.observe(this.trigger);
  }

  private resizeAwareness() {
    const onResize = () => {
      if (!this.isOpen) return;
      this.setElementRects();
      this.setModalPosition();
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const _ of entries) {
        onResize();
      }
    });

    resizeObserver.observe(document.body);
  }
}
