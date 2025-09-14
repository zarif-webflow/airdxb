// src/utils/util.ts
var AssertionError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
};
var assertValue = (value, message, condition) => {
  if (value === null || value === void 0 || Number.isNaN(value) || condition && !condition(value)) {
    throw new AssertionError(message);
  }
  return value;
};
var fallback = (value, replacementValue, condition) => {
  if (value !== void 0 && condition && !condition(value)) return replacementValue;
  if (value === void 0 || Number.isNaN(value)) return replacementValue;
  if (value === 0) return value;
  return value;
};
var hexToRgb = (hex) => {
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }
  if (hex.length !== 3 && hex.length !== 6) {
    return null;
  }
  if (hex.length === 3) {
    hex = hex.split("").map((char) => char + char).join("");
  }
  const num = parseInt(hex, 16);
  const r = num >> 16 & 255;
  const g = num >> 8 & 255;
  const b = num & 255;
  return { r, g, b };
};
var getAssertedHtmlElement = (selector, parent) => {
  return assertValue(
    (parent || document).querySelector(selector),
    `Element: ${selector} was not found!`
  );
};
var getAssertedHtmlElements = (selector, parent) => {
  const elements = (parent || document).querySelectorAll(selector);
  if (elements.length === 0) throw new Error(`Element: ${selector} was not found!`);
  return Array.from(elements);
};
var setStyle = (element, styles) => {
  const prevValues = {};
  for (const key of Object.keys(styles)) {
    prevValues[key] = element.style.getPropertyValue(key);
    element.style.setProperty(key, styles[key] || null);
  }
  return {
    revert: () => {
      Object.assign(element.style, prevValues);
    }
  };
};
var parseFloatFallback = (inputStr, fallbackValue) => {
  if (inputStr === void 0) return fallbackValue;
  const parsedValue = Number.parseFloat(inputStr);
  return Number.isNaN(parsedValue) ? fallbackValue : parsedValue;
};

export {
  assertValue,
  fallback,
  hexToRgb,
  getAssertedHtmlElement,
  getAssertedHtmlElements,
  setStyle,
  parseFloatFallback
};
//# sourceMappingURL=chunk-PPDCEJL5.js.map
