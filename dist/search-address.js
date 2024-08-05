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

  // node_modules/.pnpm/@googlemaps+js-api-loader@1.16.8/node_modules/@googlemaps/js-api-loader/dist/index.mjs
  init_live_reload();
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var fastDeepEqual = function equal(a, b) {
    if (a === b)
      return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
      if (a.constructor !== b.constructor)
        return false;
      var length, i, keys;
      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length)
          return false;
        for (i = length; i-- !== 0; )
          if (!equal(a[i], b[i]))
            return false;
        return true;
      }
      if (a.constructor === RegExp)
        return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf)
        return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString)
        return a.toString() === b.toString();
      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length)
        return false;
      for (i = length; i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
          return false;
      for (i = length; i-- !== 0; ) {
        var key = keys[i];
        if (!equal(a[key], b[key]))
          return false;
      }
      return true;
    }
    return a !== a && b !== b;
  };
  var isEqual = /* @__PURE__ */ getDefaultExportFromCjs(fastDeepEqual);
  var DEFAULT_ID = "__googleMapsScriptId";
  var LoaderStatus;
  (function(LoaderStatus2) {
    LoaderStatus2[LoaderStatus2["INITIALIZED"] = 0] = "INITIALIZED";
    LoaderStatus2[LoaderStatus2["LOADING"] = 1] = "LOADING";
    LoaderStatus2[LoaderStatus2["SUCCESS"] = 2] = "SUCCESS";
    LoaderStatus2[LoaderStatus2["FAILURE"] = 3] = "FAILURE";
  })(LoaderStatus || (LoaderStatus = {}));
  var Loader = class _Loader {
    /**
     * Creates an instance of Loader using [[LoaderOptions]]. No defaults are set
     * using this library, instead the defaults are set by the Google Maps
     * JavaScript API server.
     *
     * ```
     * const loader = Loader({apiKey, version: 'weekly', libraries: ['places']});
     * ```
     */
    constructor({ apiKey: apiKey2, authReferrerPolicy, channel, client, id = DEFAULT_ID, language, libraries = [], mapIds, nonce, region, retries = 3, url = "https://maps.googleapis.com/maps/api/js", version }) {
      this.callbacks = [];
      this.done = false;
      this.loading = false;
      this.errors = [];
      this.apiKey = apiKey2;
      this.authReferrerPolicy = authReferrerPolicy;
      this.channel = channel;
      this.client = client;
      this.id = id || DEFAULT_ID;
      this.language = language;
      this.libraries = libraries;
      this.mapIds = mapIds;
      this.nonce = nonce;
      this.region = region;
      this.retries = retries;
      this.url = url;
      this.version = version;
      if (_Loader.instance) {
        if (!isEqual(this.options, _Loader.instance.options)) {
          throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(_Loader.instance.options)}`);
        }
        return _Loader.instance;
      }
      _Loader.instance = this;
    }
    get options() {
      return {
        version: this.version,
        apiKey: this.apiKey,
        channel: this.channel,
        client: this.client,
        id: this.id,
        libraries: this.libraries,
        language: this.language,
        region: this.region,
        mapIds: this.mapIds,
        nonce: this.nonce,
        url: this.url,
        authReferrerPolicy: this.authReferrerPolicy
      };
    }
    get status() {
      if (this.errors.length) {
        return LoaderStatus.FAILURE;
      }
      if (this.done) {
        return LoaderStatus.SUCCESS;
      }
      if (this.loading) {
        return LoaderStatus.LOADING;
      }
      return LoaderStatus.INITIALIZED;
    }
    get failed() {
      return this.done && !this.loading && this.errors.length >= this.retries + 1;
    }
    /**
     * CreateUrl returns the Google Maps JavaScript API script url given the [[LoaderOptions]].
     *
     * @ignore
     * @deprecated
     */
    createUrl() {
      let url = this.url;
      url += `?callback=__googleMapsCallback&loading=async`;
      if (this.apiKey) {
        url += `&key=${this.apiKey}`;
      }
      if (this.channel) {
        url += `&channel=${this.channel}`;
      }
      if (this.client) {
        url += `&client=${this.client}`;
      }
      if (this.libraries.length > 0) {
        url += `&libraries=${this.libraries.join(",")}`;
      }
      if (this.language) {
        url += `&language=${this.language}`;
      }
      if (this.region) {
        url += `&region=${this.region}`;
      }
      if (this.version) {
        url += `&v=${this.version}`;
      }
      if (this.mapIds) {
        url += `&map_ids=${this.mapIds.join(",")}`;
      }
      if (this.authReferrerPolicy) {
        url += `&auth_referrer_policy=${this.authReferrerPolicy}`;
      }
      return url;
    }
    deleteScript() {
      const script = document.getElementById(this.id);
      if (script) {
        script.remove();
      }
    }
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     * @deprecated, use importLibrary() instead.
     */
    load() {
      return this.loadPromise();
    }
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     *
     * @ignore
     * @deprecated, use importLibrary() instead.
     */
    loadPromise() {
      return new Promise((resolve, reject) => {
        this.loadCallback((err) => {
          if (!err) {
            resolve(window.google);
          } else {
            reject(err.error);
          }
        });
      });
    }
    importLibrary(name) {
      this.execute();
      return google.maps.importLibrary(name);
    }
    /**
     * Load the Google Maps JavaScript API script with a callback.
     * @deprecated, use importLibrary() instead.
     */
    loadCallback(fn) {
      this.callbacks.push(fn);
      this.execute();
    }
    /**
     * Set the script on document.
     */
    setScript() {
      var _a, _b;
      if (document.getElementById(this.id)) {
        this.callback();
        return;
      }
      const params = {
        key: this.apiKey,
        channel: this.channel,
        client: this.client,
        libraries: this.libraries.length && this.libraries,
        v: this.version,
        mapIds: this.mapIds,
        language: this.language,
        region: this.region,
        authReferrerPolicy: this.authReferrerPolicy
      };
      Object.keys(params).forEach(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (key) => !params[key] && delete params[key]
      );
      if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.maps) === null || _b === void 0 ? void 0 : _b.importLibrary)) {
        ((g) => {
          let h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
          b = b[c] || (b[c] = {});
          const d = b.maps || (b.maps = {}), r = /* @__PURE__ */ new Set(), e = new URLSearchParams(), u = () => (
            // @ts-ignore
            h || (h = new Promise((f, n) => __awaiter(this, void 0, void 0, function* () {
              var _a2;
              yield a = m.createElement("script");
              a.id = this.id;
              e.set("libraries", [...r] + "");
              for (k in g)
                e.set(k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()), g[k]);
              e.set("callback", c + ".maps." + q);
              a.src = this.url + `?` + e;
              d[q] = f;
              a.onerror = () => h = n(Error(p + " could not load."));
              a.nonce = this.nonce || ((_a2 = m.querySelector("script[nonce]")) === null || _a2 === void 0 ? void 0 : _a2.nonce) || "";
              m.head.append(a);
            })))
          );
          d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
        })(params);
      }
      const libraryPromises = this.libraries.map((library) => this.importLibrary(library));
      if (!libraryPromises.length) {
        libraryPromises.push(this.importLibrary("core"));
      }
      Promise.all(libraryPromises).then(() => this.callback(), (error) => {
        const event = new ErrorEvent("error", { error });
        this.loadErrorCallback(event);
      });
    }
    /**
     * Reset the loader state.
     */
    reset() {
      this.deleteScript();
      this.done = false;
      this.loading = false;
      this.errors = [];
      this.onerrorEvent = null;
    }
    resetIfRetryingFailed() {
      if (this.failed) {
        this.reset();
      }
    }
    loadErrorCallback(e) {
      this.errors.push(e);
      if (this.errors.length <= this.retries) {
        const delay = this.errors.length * Math.pow(2, this.errors.length);
        console.error(`Failed to load Google Maps script, retrying in ${delay} ms.`);
        setTimeout(() => {
          this.deleteScript();
          this.setScript();
        }, delay);
      } else {
        this.onerrorEvent = e;
        this.callback();
      }
    }
    callback() {
      this.done = true;
      this.loading = false;
      this.callbacks.forEach((cb) => {
        cb(this.onerrorEvent);
      });
      this.callbacks = [];
    }
    execute() {
      this.resetIfRetryingFailed();
      if (this.loading) {
        return;
      }
      if (this.done) {
        this.callback();
      } else {
        if (window.google && window.google.maps && window.google.maps.version) {
          console.warn("Google Maps already loaded outside @googlemaps/js-api-loader. This may result in undesirable behavior as options and script parameters may not match.");
          this.callback();
          return;
        }
        this.loading = true;
        this.setScript();
      }
    }
  };

  // src/fetchers/address.ts
  var import_lodash = __toESM(require_lodash(), 1);

  // src/utils/util.ts
  init_live_reload();
  function assertValue(value, errorMessage) {
    if (value === null || value === void 0) {
      throw new Error(errorMessage ?? "Value was not provided!");
    }
    return value;
  }

  // src/fetchers/address.ts
  var apiKey = assertValue(document.body.dataset.placesKey, "places api key was not found!");
  var loader = new Loader({
    apiKey,
    version: "weekly"
  });
  var getFetchAddressesFunc = async () => {
    const service = new (await loader.importLibrary("places")).AutocompleteService();
    const addressQueryCache = /* @__PURE__ */ new Map();
    const fetchAddresses2 = (query, callback) => {
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
    const debouncedFetchAddresses = (0, import_lodash.default)(fetchAddresses2, 100);
    return { fetchAddresses: debouncedFetchAddresses };
  };
  var fetchAddresses = getFetchAddressesFunc();

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
    let resultItems = [];
    let highlightedIndex = 0;
    const setResultItems = (items) => {
      resultItems = items;
    };
    const setHighlightedIndex = (index) => {
      const prevItem = resultItems[highlightedIndex];
      const currItem = resultItems[index];
      prevItem?.classList.remove("focused");
      currItem?.classList.add("focused");
      highlightedIndex = index;
    };
    let keyboardNavigationCallback = void 0;
    let clickOutsideCallback = void 0;
    const selectResultItem = (index) => {
      const selectedItem = resultItems[index];
      const textElement = assertValue(
        selectedItem?.querySelector("p"),
        "List item paragraph element was not found!"
      );
      const text = textElement.textContent?.trim();
      if (!text)
        throw new Error("Result item is invalid");
      addressInput.value = text;
      addressInput.focus();
    };
    const closeResultModal = () => {
      addressResultContainer.classList.add("is--hidden");
      if (clickOutsideCallback !== void 0) {
        document.body.removeEventListener("mousedown", clickOutsideCallback);
      }
      if (keyboardNavigationCallback !== void 0) {
        document.removeEventListener("keydown", keyboardNavigationCallback);
      }
    };
    const setupEventListeners = () => {
      for (let i = 0; i < resultItems.length; i++) {
        const resultItem = resultItems[i];
        resultItem.addEventListener("mouseenter", () => {
          setHighlightedIndex(i);
        });
        resultItem.addEventListener("click", () => {
          selectResultItem(i);
          closeResultModal();
        });
      }
      if (clickOutsideCallback !== void 0) {
        document.body.removeEventListener("mousedown", clickOutsideCallback);
      }
      clickOutsideCallback = (e) => {
        if (e.target.closest("[data-address-container]"))
          return;
        closeResultModal();
      };
      document.body.addEventListener("mousedown", clickOutsideCallback);
      if (keyboardNavigationCallback !== void 0) {
        document.removeEventListener("keydown", keyboardNavigationCallback);
      }
      keyboardNavigationCallback = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addressInput.blur();
          selectResultItem(highlightedIndex);
          addressInput.focus();
          closeResultModal();
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightedIndex(highlightedIndex >= resultItems.length - 1 ? 0 : highlightedIndex + 1);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightedIndex(highlightedIndex <= 0 ? resultItems.length - 1 : highlightedIndex - 1);
        }
      };
      document.addEventListener("keydown", keyboardNavigationCallback);
    };
    const openResultModal = () => {
      addressResultContainer.classList.remove("is--hidden");
    };
    const renderAddressList = (addresses) => {
      addressResultList.innerHTML = "";
      setHighlightedIndex(0);
      if (addresses.length === 0) {
        setResultItems([]);
        return;
      }
      const resultItems2 = [];
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < addresses.length; i++) {
        const listItem = addressResultItem.cloneNode(true);
        const textElement = assertValue(
          listItem.querySelector("p"),
          "List item paragraph element was not found!"
        );
        textElement.textContent = addresses[i];
        textElement.dataset.index = i.toString();
        if (i === 0) {
          listItem.classList.add("focused");
        }
        fragment.appendChild(listItem);
        resultItems2.push(listItem);
      }
      addressResultList.appendChild(fragment);
      setResultItems(resultItems2);
      setupEventListeners();
    };
    fetchAddresses.then(({ fetchAddresses: fetchAddresses2 }) => {
      let mostRecentInputTimestamp = void 0;
      addressInput.addEventListener("input", (e) => {
        const event = e;
        const inputElement = event.target;
        const value = inputElement.value;
        const currentTimestamp = Date.now();
        mostRecentInputTimestamp = currentTimestamp;
        if (value === "") {
          renderAddressList([]);
          closeResultModal();
          return;
        }
        fetchAddresses2(value, (result) => {
          if (mostRecentInputTimestamp !== void 0 && mostRecentInputTimestamp !== currentTimestamp)
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
    renderAddressList([]);
  };
  initSearchAddress();
})();
//# sourceMappingURL=search-address.js.map
