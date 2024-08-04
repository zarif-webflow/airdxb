import debounce from 'lodash.debounce';

const addressQueryCache: Map<string, string[]> = new Map();

const service = new google.maps.places.AutocompleteService();

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

export const debouncedFetchAddresses = debounce(fetchAddresses, 100);
