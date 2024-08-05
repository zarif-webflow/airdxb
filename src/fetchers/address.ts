import { Loader } from '@googlemaps/js-api-loader';
import debounce from 'lodash.debounce';

import { assertValue } from '@/utils/util';

const apiKey = assertValue(document.body.dataset.placesKey, 'places api key was not found!');

const loader = new Loader({
  apiKey,
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

    const returnCallback = function (
      predictions: google.maps.places.QueryAutocompletePrediction[] | null,
      status: google.maps.places.PlacesServiceStatus
    ) {
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
