import { getAssertedHtmlElement, getAssertedHtmlElements, setStyle } from '@/utils/util';

const hideAnElement = <TElement extends HTMLElement = HTMLElement>(element: TElement): void => {
  setStyle(element, {
    display: 'none',
    width: '1px',
    height: '1px',
    padding: '0px',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0px, 0px, 0px, 0px)',
    'white-space': 'nowrap',
    'overflow-wrap': 'normal',
  });
};

const generatedUids: Set<string> = new Set();

export class Selectron {
  private rootElement: HTMLElement;
  private nativeSelect: HTMLSelectElement;
  private trigger: HTMLElement;
  private triggerValue: HTMLElement;
  private content: HTMLElement;
  private viewport: HTMLElement;
  private fragment: DocumentFragment;
  private optionItems: Record<string, { element: HTMLElement; isDefault: boolean }>;
  private elementIds: {
    rootElement: string;
    trigger: string;
    content: string;
    viewport: string;
    id: string;
  };
  private isContentRectSet: boolean = false;
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

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.fragment = document.createDocumentFragment();
    this.trigger = getAssertedHtmlElement('[data-st-trigger]', this.rootElement);
    this.triggerValue = getAssertedHtmlElement('[data-st-value]', this.trigger);
    this.content = getAssertedHtmlElement('[data-st-content]', this.rootElement);

    this.viewport = getAssertedHtmlElement('[data-st-viewport]', this.rootElement);
    this.optionItems = this.getOptionItems();
    this.elementIds = this.generateElementIds();
    this.nativeSelect = this.setupNativeSelect();

    this.setElementRects();

    // remove main listbox from dom
    this.fragment.appendChild(this.content);

    this.initialAriaSetup();

    this.setupEventListeners();
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
    const optionItems: typeof this.optionItems = {};

    const optionElements = getAssertedHtmlElements('[data-st-option]', this.rootElement);

    for (const element of optionElements) {
      const value = element.getAttribute('value') ?? element.textContent?.trim();

      if (value === undefined)
        throw new Error('Option element must have a value or a text content!');

      element.setAttribute('value', value);
      optionItems[value] = { element, isDefault: element.hasAttribute('selected') };
    }

    return optionItems;
  }

  private setupNativeSelect() {
    let isDefaultSelected = false;

    const nativeSelect = document.createElement('select');

    const selectName = this.rootElement.getAttribute('name');
    selectName && (nativeSelect.name = selectName);

    nativeSelect.ariaHidden = 'true';
    nativeSelect.tabIndex = -1;

    const optionsFragment = document.createDocumentFragment();

    for (const optionValue of Object.keys(this.optionItems)) {
      const isDefault = this.optionItems[optionValue]?.isDefault;

      const optionElement = document.createElement('option');

      optionElement.value = optionValue;
      optionElement.textContent = optionValue;

      if (isDefault && !isDefaultSelected) {
        optionElement.setAttribute('selected', '');
        isDefaultSelected = true;
      }

      optionsFragment.appendChild(optionElement);
    }

    nativeSelect.appendChild(optionsFragment);
    hideAnElement(nativeSelect);

    this.rootElement.appendChild(nativeSelect);

    return nativeSelect;
  }

  private initialAriaSetup() {
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

    // Viewport
    this.viewport.role = 'presentation';

    // Options
    for (const optionItem of Object.values(this.optionItems)) {
      optionItem.element.role = 'option';
      optionItem.element.tabIndex = -1;
      optionItem.element.ariaSelected = optionItem.isDefault ? 'true' : 'false';
      optionItem.element.dataset.selected = optionItem.isDefault ? 'true' : 'false';

      const svgs = optionItem.element.querySelectorAll('svg');

      svgs.forEach((svg) => {
        svg.ariaHidden = 'true';
      });

      optionItem.element.addEventListener('click', () => {
        this.selectOption(optionItem.element);
      });
    }
  }

  private removeSelection() {
    for (const [value, optionItem] of Object.entries(this.optionItems)) {
      if (value === '') {
        this.triggerValue.textContent = optionItem.element.textContent;
        optionItem.element.dataset.selected = 'false';
        optionItem.element.ariaSelected = 'false';
        continue;
      }

      optionItem.element.ariaSelected = 'false';
      optionItem.element.dataset.selected = 'false';
      optionItem.element.classList.remove('selected');
    }
    this.nativeSelect.value = '';
  }

  private selectOption(optionElement: HTMLElement) {
    this.removeSelection();

    const value = optionElement.getAttribute('value');

    if (value === null) {
      throw new Error('Option element must have a value!');
    }

    this.nativeSelect.value = value;

    this.triggerValue.textContent = optionElement.textContent;

    optionElement.ariaSelected = 'true';
    optionElement.dataset.selected = 'true';
    optionElement.classList.add('selected');

    this.closeModal();
  }

  private closeModal() {
    this.fragment.appendChild(this.content);
    this.isOpen = false;
    document.body.removeEventListener('click', this.clickOutsideCallback);
  }

  private clickOutsideCallback(e: MouseEvent) {
    const target = e.target as Node;

    if (
      this.content.isSameNode(target) ||
      this.content.contains(target) ||
      this.rootElement.isSameNode(target) ||
      this.rootElement.contains(target)
    )
      return;

    this.closeModal();
  }

  private openModal() {
    document.body.appendChild(this.content);
    this.isOpen = true;
    this.setModalPosition();

    document.body.addEventListener('click', this.clickOutsideCallback);
  }

  private setElementRects() {
    const triggerRect = this.trigger.getBoundingClientRect();
    const contentRect = this.content.getBoundingClientRect();

    this.triggerRect.offsetTop = this.trigger.offsetTop;
    this.triggerRect.offsetLeft = this.trigger.offsetLeft;
    this.triggerRect.width = triggerRect.width;
    this.triggerRect.height = triggerRect.height;

    this.contentRect.offsetTop = this.triggerRect.offsetTop + this.triggerRect.height;
    this.contentRect.offsetLeft = this.triggerRect.offsetLeft;
    this.contentRect.width = contentRect.width;
    this.contentRect.height = contentRect.height;

    setStyle(this.content, {
      position: 'absolute',
      'min-width': `${this.contentRect.width}px`,
      left: `${this.contentRect.offsetLeft}px`,
    });
  }

  private setModalPosition() {
    const { offsetTop, height: contentHeight } = this.contentRect;
    const { height: triggerHeight, offsetTop: triggerOffsetTop } = this.triggerRect;

    const contentWindowTop =
      this.trigger.getBoundingClientRect().top + triggerHeight + contentHeight + 80;

    const targetPosition: NonNullable<typeof this.position> =
      window.innerHeight > contentWindowTop ? 'bottom' : 'top';

    if (this.position !== undefined && targetPosition === this.position) return;

    this.position = targetPosition;

    if (targetPosition === 'bottom') {
      setStyle(this.content, {
        top: `${offsetTop}px`,
        transform: `translateX(0px) translateY(0px)`,
      });
    } else {
      setStyle(this.content, {
        top: `${triggerOffsetTop - contentHeight}px`,
        transform: `translateX(0px) translateY(0px)`,
      });
    }
  }

  private setupEventListeners() {
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
}
