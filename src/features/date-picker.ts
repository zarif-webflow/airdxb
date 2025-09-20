import { getMultipleHtmlElements } from "@taj-wf/utils";
import { Datepicker } from "vanillajs-datepicker";

// const formatter = new Intl.DateTimeFormat("en-AE", {
//   timeZone: "Asia/Dubai",
//   year: "numeric",
//   month: "long",
//   day: "2-digit",
// });

// const valueFormatter = new Intl.DateTimeFormat("en-AE", {
//   day: "2-digit",
//   month: "2-digit",
//   year: "numeric",
// });

const hsDateFormatter = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${day}-${month}-${year}`;
};

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
          return date;
        },
        toDisplay(date) {
          const dateObject = new Date(date);
          return hsDateFormatter(dateObject);
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
