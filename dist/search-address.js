"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // bin/live-reload.js
  var init_live_reload = __esm({
    "bin/live-reload.js"() {
      "use strict";
      new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());
    }
  });

  // node_modules/.pnpm/lodash.debounce@4.0.8/node_modules/lodash.debounce/index.js
  var require_lodash = __commonJS({
    "node_modules/.pnpm/lodash.debounce@4.0.8/node_modules/lodash.debounce/index.js"(exports, module) {
      init_live_reload();
      var FUNC_ERROR_TEXT = "Expected a function";
      var NAN = 0 / 0;
      var symbolTag = "[object Symbol]";
      var reTrim = /^\s+|\s+$/g;
      var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
      var reIsBinary = /^0b[01]+$/i;
      var reIsOctal = /^0o[0-7]+$/i;
      var freeParseInt = parseInt;
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root = freeGlobal || freeSelf || Function("return this")();
      var objectProto = Object.prototype;
      var objectToString = objectProto.toString;
      var nativeMax = Math.max;
      var nativeMin = Math.min;
      var now = function() {
        return root.Date.now();
      };
      function debounce2(func, wait, options) {
        var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
        if (typeof func != "function") {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        wait = toNumber(wait) || 0;
        if (isObject(options)) {
          leading = !!options.leading;
          maxing = "maxWait" in options;
          maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        function invokeFunc(time) {
          var args = lastArgs, thisArg = lastThis;
          lastArgs = lastThis = void 0;
          lastInvokeTime = time;
          result = func.apply(thisArg, args);
          return result;
        }
        function leadingEdge(time) {
          lastInvokeTime = time;
          timerId = setTimeout(timerExpired, wait);
          return leading ? invokeFunc(time) : result;
        }
        function remainingWait(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result2 = wait - timeSinceLastCall;
          return maxing ? nativeMin(result2, maxWait - timeSinceLastInvoke) : result2;
        }
        function shouldInvoke(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
          return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
        }
        function timerExpired() {
          var time = now();
          if (shouldInvoke(time)) {
            return trailingEdge(time);
          }
          timerId = setTimeout(timerExpired, remainingWait(time));
        }
        function trailingEdge(time) {
          timerId = void 0;
          if (trailing && lastArgs) {
            return invokeFunc(time);
          }
          lastArgs = lastThis = void 0;
          return result;
        }
        function cancel() {
          if (timerId !== void 0) {
            clearTimeout(timerId);
          }
          lastInvokeTime = 0;
          lastArgs = lastCallTime = lastThis = timerId = void 0;
        }
        function flush() {
          return timerId === void 0 ? result : trailingEdge(now());
        }
        function debounced() {
          var time = now(), isInvoking = shouldInvoke(time);
          lastArgs = arguments;
          lastThis = this;
          lastCallTime = time;
          if (isInvoking) {
            if (timerId === void 0) {
              return leadingEdge(lastCallTime);
            }
            if (maxing) {
              timerId = setTimeout(timerExpired, wait);
              return invokeFunc(lastCallTime);
            }
          }
          if (timerId === void 0) {
            timerId = setTimeout(timerExpired, wait);
          }
          return result;
        }
        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
      }
      function isObject(value) {
        var type = typeof value;
        return !!value && (type == "object" || type == "function");
      }
      function isObjectLike(value) {
        return !!value && typeof value == "object";
      }
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
      }
      function toNumber(value) {
        if (typeof value == "number") {
          return value;
        }
        if (isSymbol(value)) {
          return NAN;
        }
        if (isObject(value)) {
          var other = typeof value.valueOf == "function" ? value.valueOf() : value;
          value = isObject(other) ? other + "" : other;
        }
        if (typeof value != "string") {
          return value === 0 ? value : +value;
        }
        value = value.replace(reTrim, "");
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
      }
      module.exports = debounce2;
    }
  });

  // src/features/search-address.ts
  init_live_reload();

  // src/fetchers/address.ts
  init_live_reload();
  var import_lodash = __toESM(require_lodash(), 1);
  var addressQueryCache = /* @__PURE__ */ new Map();
  var service = new google.maps.places.AutocompleteService();
  var fetchAddresses = (query, callback) => {
    const cachedResult = addressQueryCache.get(query);
    if (cachedResult !== void 0) {
      callback(cachedResult);
      return;
    }
    const returnCallback = function(predictions, status) {
      let result = [];
      if (status !== google.maps.places.PlacesServiceStatus.OK && status !== "ZERO_RESULTS") {
        console.error(`Something went wrong with places api. Status ${status}`);
      }
      if (predictions !== null) {
        result = predictions.map((item) => item.description);
      }
      addressQueryCache.set(query, result);
      callback(result);
    };
    service.getPlacePredictions(
      { input: query, componentRestrictions: { country: "ae" } },
      returnCallback
    );
  };
  var debouncedFetchAddresses = (0, import_lodash.default)(fetchAddresses, 100);

  // src/utils/util.ts
  init_live_reload();
  function assertValue(value, errorMessage) {
    if (value === null || value === void 0) {
      throw new Error(errorMessage ?? "Value was not provided!");
    }
    return value;
  }

  // src/features/search-address.ts
  var initSearchAddress = () => {
    const addressInput = assertValue(
      document.querySelector("[data-address-input]"),
      `Address input element([data-address-input]) was not found!`
    );
    const addressResultContainer = assertValue(
      addressInput.closest("[data-address-container]")?.querySelector("[data-address-result]"),
      `Address result container([data-address-result]) was not found!`
    );
    const addressResultList = assertValue(
      addressResultContainer?.querySelector("[data-address-list]"),
      `Address result list([data-address-list]) was not found!`
    );
    const addressResultItem = assertValue(
      addressResultList?.querySelector("[data-address-item]"),
      `Address result item([data-address-item]) was not found!`
    );
    const closeResultModal = () => {
      addressResultContainer.classList.add("is--hidden");
    };
    const openResultModal = (listItems) => {
      const resultItems = listItems || Array.from(addressResultList.querySelectorAll("[data-address-item]"));
      const listItemsLength = resultItems.length;
      if (listItemsLength === 0) {
        closeResultModal();
        return;
      }
      addressResultContainer.classList.remove("is--hidden");
      let activeIndex = 0;
      const dehighlightItem = () => {
        const selectedItem = resultItems[activeIndex];
        selectedItem.classList.remove("focused");
      };
      const highlightItem = () => {
        const selectedItem = resultItems[activeIndex];
        selectedItem.classList.add("focused");
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
          selectedItem.querySelector("p"),
          "List item paragraph element was not found!"
        );
        const text = textElement.textContent?.trim();
        if (!text)
          throw new Error("Result item is invalid");
        addressInput.value = text;
        closeResultModal();
        activeIndex = 0;
      };
      const keyboardNavigationCallback = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addressInput.blur();
          enterCallback();
          addressInput.focus();
          document.removeEventListener("keydown", keyboardNavigationCallback);
        }
        if (e.key === "ArrowDown") {
          goDown();
        }
        if (e.key === "ArrowUp") {
          goUp();
        }
      };
      const clickOutsideCallback = (e) => {
        if (e.target.closest("[data-address-container]"))
          return;
        closeResultModal();
        document.body.removeEventListener("mousedown", clickOutsideCallback);
        document.removeEventListener("keydown", keyboardNavigationCallback);
      };
      const resultItemClickCallback = (e) => {
        const selectedItem = e.target.closest("[data-address-item]");
        if (selectedItem === null)
          return;
        const textElement = assertValue(
          selectedItem.querySelector("p"),
          "List item paragraph element was not found!"
        );
        const text = textElement.textContent?.trim();
        if (!text)
          throw new Error("Result item is invalid");
        addressInput.value = text;
        closeResultModal();
        document.body.removeEventListener("mousedown", clickOutsideCallback);
        document.removeEventListener("keydown", keyboardNavigationCallback);
        addressResultContainer.removeEventListener("click", resultItemClickCallback);
      };
      highlightItem();
      document.body.addEventListener("mousedown", clickOutsideCallback);
      document.addEventListener("keydown", keyboardNavigationCallback);
      addressResultContainer.addEventListener("click", resultItemClickCallback);
    };
    const renderAddressList = (addresses) => {
      addressResultList.innerHTML = "";
      if (addresses.length === 0)
        return;
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < addresses.length; i++) {
        const listItem = addressResultItem.cloneNode(true);
        const textElement = assertValue(
          listItem.querySelector("p"),
          "List item paragraph element was not found!"
        );
        textElement.textContent = addresses[i];
        textElement.dataset.index = i.toString();
        fragment.appendChild(listItem);
      }
      addressResultList.appendChild(fragment);
    };
    renderAddressList([]);
    let mostRecentInputTimestamp = void 0;
    addressInput.addEventListener("input", (e) => {
      const event = e;
      const inputElement = event.target;
      const value = inputElement.value;
      const currentTimestamp = Date.now();
      mostRecentInputTimestamp = currentTimestamp;
      if (value === "") {
        closeResultModal();
        return;
      }
      debouncedFetchAddresses(value, (result) => {
        if (mostRecentInputTimestamp !== void 0 && mostRecentInputTimestamp !== currentTimestamp)
          return;
        renderAddressList(result);
        openResultModal();
      });
    });
  };
  initSearchAddress();
})();
//# sourceMappingURL=search-address.js.map
