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
  private trigger: HTMLElement;
  private content: HTMLElement;
  private viewport: HTMLElement;
  private optionItems: Record<string, { element: HTMLElement; isDefault: boolean }>;
  private elementIds: {
    rootElement: string;
    trigger: string;
    content: string;
    viewport: string;
    id: string;
  };

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
    this.trigger = getAssertedHtmlElement('[data-st-trigger]', this.rootElement);
    this.content = getAssertedHtmlElement('[data-st-content]', this.rootElement);
    this.viewport = getAssertedHtmlElement('[data-st-viewport]', this.rootElement);
    this.optionItems = this.getOptionItems();
    this.elementIds = this.generateElementIds();

    this.setupNativeSelect();
    this.initialAriaSetup();
  }

  generateId() {
    while (true) {
      const uid = Math.random().toString(36).substring(2, 8);
      if (generatedUids.has(uid)) continue;
      return uid;
    }
  }

  generateElementIds(): typeof this.elementIds {
    const id = `st::${this.generateId()}`;
    let rootId = this.rootElement.id;

    if (rootId === '') {
      rootId = id;
      this.rootElement.id = rootId;
    }

    const elementIds = {
      id,
      content: `${id}::content`,
      trigger: `${id}::trigger`,
      viewport: `${id}::viewport`,
      rootElement: rootId,
    };

    this.content.id = elementIds.content;
    this.trigger.id = elementIds.trigger;
    this.viewport.id = elementIds.viewport;

    return elementIds;
  }

  getOptionItems() {
    const optionItems: typeof this.optionItems = {};

    const optionElements = getAssertedHtmlElements('[data-st-option]', this.rootElement);

    for (const element of optionElements) {
      const value = element.getAttribute('value') ?? element.textContent?.trim();

      if (value === undefined)
        throw new Error('Option element must have a value or a text content!');

      optionItems[value] = { element, isDefault: element.hasAttribute('selected') };
    }

    return optionItems;
  }

  setupNativeSelect() {
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

  initialAriaSetup() {
    // Trigger
    this.trigger.setAttribute('type', 'button');
    this.trigger.tagName !== 'BUTTON' && (this.trigger.role = 'button');
    this.trigger.ariaHasPopup = 'listbox';
    this.trigger.ariaExpanded = 'false';
    this.trigger.setAttribute('aria-controls', this.elementIds.content);

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
    }
  }
}
