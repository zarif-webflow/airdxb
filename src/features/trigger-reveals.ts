const init = () => {
  const triggerRevealParents = Array.from(
    document.querySelectorAll<HTMLElement>("[data-trigger-reveal-parent]")
  );

  if (triggerRevealParents.length === 0) {
    console.error("No trigger reveal parent ([data-trigger-reveal-parent]) was found.");
    return;
  }

  let selectedTrigger: HTMLElement | undefined = undefined;
  let selectedRevealElement: HTMLElement | undefined = undefined;

  const selectTrigger = (triggerElement: HTMLElement, revealElement: HTMLElement) => {
    if (selectedTrigger) {
      selectedTrigger.classList.remove("is--active");
    }
    if (selectedRevealElement) {
      selectedRevealElement.classList.add("is--hidden");
    }

    triggerElement.classList.add("is--active");
    revealElement.classList.remove("is--hidden");

    selectedTrigger = triggerElement;
    selectedRevealElement = revealElement;
  };

  for (const triggerRevealParent of triggerRevealParents) {
    const triggers = Array.from(
      triggerRevealParent.querySelectorAll<HTMLElement>("[data-trigger]")
    );

    if (triggers.length === 0) {
      console.error(
        "No triggers([data-trigger]) were found in a trigger reveal parent ([data-trigger-reveal-parent])."
      );
      return;
    }

    let index = 0;

    for (const trigger of triggers) {
      index += 1;

      const triggerKey = trigger.dataset.trigger;

      if (!triggerKey) {
        console.error("Invalid trigger key on a reveal trigger!");
        continue;
      }

      const revealElement = triggerRevealParent.querySelector<HTMLElement>(
        `[data-trigger-value='${triggerKey}']`
      );

      if (!revealElement) {
        console.error(`No reveal element is found for [data-trigger=${triggerKey}]`);
        continue;
      }

      if (index === 2) {
        selectTrigger(trigger, revealElement);
      }

      trigger.addEventListener("click", (e) => {
        e.preventDefault();

        selectTrigger(trigger, revealElement);
      });
    }
  }
};

init();
