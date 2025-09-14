import { getHtmlElement } from "@taj-wf/utils";

const initHubspotFieldInserter = () => {
  const form = getHtmlElement({ selector: "form[data-calculator-form]", log: "error" });

  if (!form) return;

  const bedroomsSelectElement = getHtmlElement<HTMLSelectElement>({
    selector: 'select[name="bedrooms"]',
    parent: form,
    log: "error",
  });

  if (!bedroomsSelectElement) return;

  const addHubspotFieldName = () => {
    const selectRoot = form.querySelector<HTMLElement>("[data-st-root]");

    if (!selectRoot) {
      console.error("form[data-calculator-form] [data-st-root] wasn't found!");
      return;
    }

    const hubSpotFieldName = selectRoot.dataset.wfhsfieldname;

    if (hubSpotFieldName !== undefined) {
      selectRoot.removeAttribute("data-wfhsfieldname");
      bedroomsSelectElement.setAttribute("data-wfhsfieldname", hubSpotFieldName);
    }
  };

  addHubspotFieldName();
};

initHubspotFieldInserter();
