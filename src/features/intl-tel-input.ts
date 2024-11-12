import intlTelInput from 'intl-tel-input';

const errorMap = [
  'Invalid number',
  'Invalid country code',
  'Too short',
  'Too long',
  'Invalid number',
];

const run = () => {
  const intlTelInputElements = Array.from(
    document.querySelectorAll<HTMLInputElement>('[data-phone-input]')
  );

  if (intlTelInput.length === 0) throw new Error('No intl input element was found!');

  for (const input of intlTelInputElements) {
    const iti = intlTelInput(input, {
      loadUtilsOnInit: () =>
        import(
          `https://cdn.jsdelivr.net/npm/intl-tel-input@${intlTelInput.version}/build/js/utils.js`
        ),
      strictMode: true,
      separateDialCode: true,
      initialCountry: 'ae',
    });

    const inputParentForm = input.closest<HTMLFormElement>('form');

    if (!inputParentForm) return;

    const submitButton = inputParentForm.querySelector<HTMLButtonElement>(
      'button[type=submit], input[type=submit]'
    );

    if (!submitButton) throw new Error('Form submit button not found!');

    const errorElement = inputParentForm.querySelector<HTMLElement>('[data-phone-error]');

    errorElement && (errorElement.style.display = 'none');

    const hubSpotFieldName = input.dataset.wfhsfieldname;

    /**
     * Insert hidden inputs
     */
    const fullPhoneNumberInput = document.createElement('input');
    const countryNameInput = document.createElement('input');

    fullPhoneNumberInput.name = 'full_phone';
    countryNameInput.name = 'country_name';

    fullPhoneNumberInput.style.display = 'none';
    countryNameInput.style.display = 'none';

    if (hubSpotFieldName !== undefined) {
      input.removeAttribute('data-wfhsfieldname');
      fullPhoneNumberInput.setAttribute('data-wfhsfieldname', hubSpotFieldName);
    }

    inputParentForm.appendChild(fullPhoneNumberInput);
    inputParentForm.appendChild(countryNameInput);

    submitButton.type = 'button';

    let hasErrorOccured: boolean = false;

    submitButton.addEventListener('click', () => {
      if (iti.isValidNumber()) {
        errorElement && (errorElement.style.display = 'none');

        const fullNumber = iti.getNumber();
        const countryName = iti.getSelectedCountryData().name;

        fullPhoneNumberInput.value = fullNumber;
        countryNameInput.value = countryName ?? '';

        inputParentForm.requestSubmit();
        return;
      } else {
        hasErrorOccured = true;
        if (!errorElement) return;

        const errorMessage = errorMap[iti.getValidationError()];

        if (!errorMessage) return;

        errorElement.style.display = 'block';
        errorElement.innerText = errorMessage;
      }
    });

    input.addEventListener('input', () => {
      if (!hasErrorOccured) return;

      if (iti.isValidNumber()) {
        errorElement && (errorElement.style.display = 'none');
        return;
      }

      if (!errorElement) return;

      const errorMessage = errorMap[iti.getValidationError()];

      if (!errorMessage) return;

      errorElement.style.display = 'block';
      errorElement.innerText = errorMessage;
    });
  }
};

run();
