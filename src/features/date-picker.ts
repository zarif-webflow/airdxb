import { getMultipleHtmlElements } from "@taj-wf/utils";
import { Datepicker } from "vanillajs-datepicker";

const formatter = new Intl.DateTimeFormat("en-AE", {
  timeZone: "Asia/Dubai",
  year: "numeric",
  month: "long",
  day: "2-digit",
});

const initDatePicker = () => {
  const datePickerEls = getMultipleHtmlElements<HTMLInputElement>({
    selector: "[data-date-picker]",
  });

  if (!datePickerEls) return;

  for (const datePickerEl of datePickerEls) {
    new Datepicker(datePickerEl, {
      format: {
        // @ts-expect-error toValue doesn't expect string returns but supports it
        toValue(date) {
          const dateObject = new Date(date);

          return formatter.format(dateObject);
        },
        toDisplay(date) {
          const dateObject = new Date(date);
          return formatter.format(dateObject);
        },
      },
    });

    // Prevent input from being focused when clicked
    datePickerEl.addEventListener("click", () => {
      datePickerEl.blur();
    });
  }
};

initDatePicker();
