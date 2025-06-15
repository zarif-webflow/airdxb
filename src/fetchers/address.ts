import { Loader } from '@googlemaps/js-api-loader';
import { getHtmlElement } from '@taj-wf/utils';
import { debounce } from 'es-toolkit';

const getActiveScript = () => {
  const currentModuleUrl = import.meta.url;
  return getHtmlElement<HTMLScriptElement>({
    selector: `script[src="${currentModuleUrl}"]`,
  });
};

const scriptElement = getActiveScript();

if (!scriptElement) {
  throw new Error('Search Address script element was not found!');
}

const placesApiKey = scriptElement.getAttribute('data-places-key');

if (!placesApiKey) {
  throw new Error(
    'Places API key was not found in the script element! Please set data-places-key attribute in the script.'
  );
}

const loader = new Loader({
  apiKey: placesApiKey,
  version: 'weekly',
});

const getFetchAddressesFunc = async () => {
  const service = new (await loader.importLibrary('places')).AutocompleteService();

  const addressQueryCache: Map<string, string[]> = new Map();

  const fetchAddresses = (query: string, callback: (result: string[]) => void) => {
    const cachedResult = addressQueryCache.get(query);

    if (cachedResult !== undefined) {
      callback(cachedResult);
      return;
    }

    const returnCallback = (
      predictions: google.maps.places.QueryAutocompletePrediction[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) => {
      let result: string[] = [];

      if (status !== google.maps.places.PlacesServiceStatus.OK && status !== 'ZERO_RESULTS') {
        console.error(`Something went wrong with places api. Status ${status}`);
      }

      if (predictions !== null) {
        result = predictions.map((item) => item.description);
      }

      addressQueryCache.set(query, result);
      callback(result);
    };

    service.getPlacePredictions(
      { input: query, componentRestrictions: { country: 'ae' } },
      returnCallback
    );
  };

  const debouncedFetchAddresses = debounce(fetchAddresses, 100);

  return { fetchAddresses: debouncedFetchAddresses };
};

export const fetchAddresses = getFetchAddressesFunc();
