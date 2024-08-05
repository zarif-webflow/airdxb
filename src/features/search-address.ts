import { fetchAddresses } from '@/fetchers/address';
import { assertValue } from '@/utils/util';

const initSearchAddress = () => {
  /*
   * Addressing primary elements
   */
  const addressInput = assertValue(
    document.querySelector<HTMLInputElement>('[data-address-input]'),
    `Address input element([data-address-input]) was not found!`
  );
  const addressResultContainer = assertValue(
    addressInput
      .closest('[data-address-container]')
      ?.querySelector<HTMLDivElement>('[data-address-result]'),
    `Address result container([data-address-result]) was not found!`
  );
  const addressResultList = assertValue(
    addressResultContainer?.querySelector<HTMLUListElement>('[data-address-list]'),
    `Address result list([data-address-list]) was not found!`
  );
  const addressResultItem = assertValue(
    addressResultList?.querySelector<HTMLLIElement>('[data-address-item]'),
    `Address result item([data-address-item]) was not found!`
  );

  /*
   * UI States
   */
  let resultItems: HTMLLIElement[] = [];
  let highlightedIndex = 0;

  /*
   * State changer callbacks
   */
  const setResultItems = (items: HTMLLIElement[]) => {
    resultItems = items;
  };

  const setHighlightedIndex = (index: number) => {
    const prevItem = resultItems[highlightedIndex];
    const currItem = resultItems[index];

    prevItem?.classList.remove('focused');
    currItem?.classList.add('focused');

    highlightedIndex = index;
  };

  let keyboardNavigationCallback: ((e: KeyboardEvent) => void) | undefined = undefined;
  let clickOutsideCallback: ((e: MouseEvent) => void) | undefined = undefined;

  const selectResultItem = (index: number) => {
    const selectedItem = resultItems[index];

    const textElement = assertValue(
      selectedItem?.querySelector<HTMLParagraphElement>('p'),
      'List item paragraph element was not found!'
    );

    const text = textElement.textContent?.trim();

    if (!text) throw new Error('Result item is invalid'!);

    addressInput.value = text;
    addressInput.focus();
  };

  const closeResultModal = () => {
    addressResultContainer.classList.add('is--hidden');
  };

  const setupEventListeners = () => {
    /*
     * Click and hover effects
     */
    for (let i = 0; i < resultItems.length; i++) {
      const resultItem = resultItems[i]!;

      resultItem.addEventListener('mouseenter', () => {
        setHighlightedIndex(i);
      });

      resultItem.addEventListener('click', () => {
        selectResultItem(i);
        closeResultModal();
      });
    }

    /*
     * Handle outside click
     */

    if (clickOutsideCallback !== undefined) {
      document.body.removeEventListener('mousedown', clickOutsideCallback);
    }

    clickOutsideCallback = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-address-container]')) return;

      closeResultModal();
    };

    document.body.addEventListener('mousedown', clickOutsideCallback);

    /*
     * Keyboard navigation
     */

    if (keyboardNavigationCallback !== undefined) {
      document.removeEventListener('keydown', keyboardNavigationCallback);
    }

    keyboardNavigationCallback = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addressInput.blur();
        selectResultItem(highlightedIndex);
        addressInput.focus();
        closeResultModal();
      }
      if (e.key === 'ArrowDown') {
        addressInput.blur();
        setHighlightedIndex(highlightedIndex >= resultItems.length - 1 ? 0 : highlightedIndex + 1);
      }
      if (e.key === 'ArrowUp') {
        addressInput.blur();
        setHighlightedIndex(highlightedIndex <= 0 ? resultItems.length - 1 : highlightedIndex - 1);
      }
    };

    document.addEventListener('keydown', keyboardNavigationCallback);
  };

  const openResultModal = () => {
    addressResultContainer.classList.remove('is--hidden');
  };

  const renderAddressList = (addresses: string[]) => {
    addressResultList.innerHTML = '';
    setHighlightedIndex(0);

    if (addresses.length === 0) {
      setResultItems([]);
      return;
    }

    const resultItems: HTMLLIElement[] = [];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < addresses.length; i++) {
      const listItem = addressResultItem.cloneNode(true) as HTMLLIElement;

      const textElement = assertValue(
        listItem.querySelector<HTMLParagraphElement>('p'),
        'List item paragraph element was not found!'
      );

      textElement.textContent = addresses[i]!;
      textElement.dataset.index = i.toString();

      if (i === 0) {
        listItem.classList.add('focused');
      }

      fragment.appendChild(listItem);
      resultItems.push(listItem);
    }

    addressResultList.appendChild(fragment);

    setResultItems(resultItems);
    setupEventListeners();
  };

  /*
   * Main search event init
   */

  fetchAddresses.then(({ fetchAddresses }) => {
    let mostRecentInputTimestamp: number | undefined = undefined;

    addressInput.addEventListener('input', (e) => {
      const event = e as InputEvent;
      const inputElement = event.target as HTMLInputElement;

      const value = inputElement.value;

      const currentTimestamp = Date.now();
      mostRecentInputTimestamp = currentTimestamp;

      if (value === '') {
        renderAddressList([]);
        closeResultModal();
        return;
      }

      fetchAddresses(value, (result: string[]) => {
        if (mostRecentInputTimestamp !== undefined && mostRecentInputTimestamp !== currentTimestamp)
          return;
        renderAddressList(result);

        if (result.length === 0) {
          closeResultModal();
          return;
        }

        openResultModal();
      });
    });
  });

  /*
   * Initial render
   */

  renderAddressList([]);
};

initSearchAddress();
