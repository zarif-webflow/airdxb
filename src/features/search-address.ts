import { debouncedFetchAddresses } from '@/fetchers/address';
import { assertValue } from '@/utils/util';

const initSearchAddress = () => {
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

  const closeResultModal = () => {
    addressResultContainer.classList.add('is--hidden');
  };

  const openResultModal = (listItems?: HTMLLIElement[]) => {
    const resultItems =
      listItems ||
      Array.from(addressResultList.querySelectorAll<HTMLLIElement>('[data-address-item]'));

    const listItemsLength = resultItems.length;

    if (listItemsLength === 0) {
      closeResultModal();
      return;
    }

    addressResultContainer.classList.remove('is--hidden');

    let activeIndex = 0;

    const dehighlightItem = () => {
      const selectedItem = resultItems[activeIndex];
      selectedItem.classList.remove('focused');
    };

    const highlightItem = () => {
      const selectedItem = resultItems[activeIndex];
      selectedItem.classList.add('focused');
    };

    const goDown = () => {
      dehighlightItem();

      const newIndex = activeIndex + 1;

      if (newIndex > listItemsLength - 1) {
        activeIndex = 0;
      } else {
        activeIndex = newIndex;
      }

      highlightItem();
    };

    const goUp = () => {
      dehighlightItem();

      const newIndex = activeIndex - 1;

      if (newIndex < 0) {
        activeIndex = listItemsLength - 1;
      } else {
        activeIndex = newIndex;
      }

      highlightItem();
    };
    const enterCallback = () => {
      const selectedItem = resultItems[activeIndex];

      const textElement = assertValue(
        selectedItem.querySelector<HTMLParagraphElement>('p'),
        'List item paragraph element was not found!'
      );

      const text = textElement.textContent?.trim();

      if (!text) throw new Error('Result item is invalid'!);

      addressInput.value = text;

      closeResultModal();
      activeIndex = 0;
    };

    const keyboardNavigationCallback = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addressInput.blur();
        enterCallback();
        addressInput.focus();
        document.removeEventListener('keydown', keyboardNavigationCallback);
      }
      if (e.key === 'ArrowDown') {
        goDown();
      }
      if (e.key === 'ArrowUp') {
        goUp();
      }
    };

    const clickOutsideCallback = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-address-container]')) return;

      closeResultModal();
      document.body.removeEventListener('mousedown', clickOutsideCallback);
      document.removeEventListener('keydown', keyboardNavigationCallback);
    };

    const resultItemClickCallback = (e: MouseEvent) => {
      const selectedItem = (e.target as HTMLElement).closest<HTMLLIElement>('[data-address-item]');

      if (selectedItem === null) return;

      const textElement = assertValue(
        selectedItem.querySelector<HTMLParagraphElement>('p'),
        'List item paragraph element was not found!'
      );

      const text = textElement.textContent?.trim();

      if (!text) throw new Error('Result item is invalid'!);

      addressInput.value = text;

      closeResultModal();

      document.body.removeEventListener('mousedown', clickOutsideCallback);
      document.removeEventListener('keydown', keyboardNavigationCallback);
      addressResultContainer.removeEventListener('click', resultItemClickCallback);
    };

    highlightItem();
    document.body.addEventListener('mousedown', clickOutsideCallback);
    document.addEventListener('keydown', keyboardNavigationCallback);
    addressResultContainer.addEventListener('click', resultItemClickCallback);
  };

  const renderAddressList = (addresses: string[]) => {
    addressResultList.innerHTML = '';

    if (addresses.length === 0) return;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < addresses.length; i++) {
      const listItem = addressResultItem.cloneNode(true) as HTMLLIElement;

      const textElement = assertValue(
        listItem.querySelector<HTMLParagraphElement>('p'),
        'List item paragraph element was not found!'
      );

      textElement.textContent = addresses[i];
      textElement.dataset.index = i.toString();
      fragment.appendChild(listItem);
    }

    addressResultList.appendChild(fragment);
  };

  renderAddressList([]);

  let mostRecentInputTimestamp: number | undefined = undefined;

  addressInput.addEventListener('input', (e) => {
    const event = e as InputEvent;
    const inputElement = event.target as HTMLInputElement;

    const value = inputElement.value;

    const currentTimestamp = Date.now();
    mostRecentInputTimestamp = currentTimestamp;

    if (value === '') {
      closeResultModal();
      return;
    }

    debouncedFetchAddresses(value, (result: string[]) => {
      if (mostRecentInputTimestamp !== undefined && mostRecentInputTimestamp !== currentTimestamp)
        return;
      renderAddressList(result);
      openResultModal();
    });
  });
};

initSearchAddress();
