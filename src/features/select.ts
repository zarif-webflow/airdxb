import { setupSelectron } from '@/packages/selectron';
import { getAssertedHtmlElement } from '@/utils/util';

setupSelectron(getAssertedHtmlElement('[data-st-root]'));

/*
import { computePosition, flip, shift, offset, size, autoUpdate } from '@floating-ui/dom';
import { trackInteractOutside } from '@zag-js/interact-outside';

const button = getAssertedHtmlElement('[data-st-trigger]');
const selectContent = getAssertedHtmlElement('[data-st-content]');
const fragment = document.createDocumentFragment();
let visible = false;
let cleanup: (() => void) | undefined = undefined;
let cleanupOutsideInteraction: (() => void) | undefined = undefined;

const updatePlacement = () => {
  computePosition(button, selectContent, {
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip(),
      shift(),
      size({
        apply: ({ rects }) => {
          Object.assign(selectContent.style, {
            'min-width': `${rects.reference.width}px`,
          });
        },
      }),
    ],
  }).then(({ x, y }) => {
    Object.assign(selectContent.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  });
};

// updatePlacement();

const showContent = () => {
  if (visible) return;

  document.body.appendChild(selectContent);
  selectContent.style.visibility = 'visible';

  updatePlacement();

  cleanup = autoUpdate(button, selectContent, updatePlacement);

  visible = true;

  cleanupOutsideInteraction = trackInteractOutside(selectContent, {
    onPointerDownOutside: hideContent,
    onInteractOutside: hideContent,
    onFocusOutside: hideContent,
    exclude: (target) => button.isSameNode(target) || button.contains(target),
  });
};

const hideContent = () => {
  if (!visible) return;

  fragment.appendChild(selectContent);
  selectContent.style.visibility = 'hidden';

  visible = false;

  cleanup?.();
  cleanupOutsideInteraction?.();
};

button.addEventListener('click', () => {
  if (!visible) {
    showContent();
    return;
  }
  hideContent();
});
*/
