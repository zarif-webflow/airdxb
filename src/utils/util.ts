export function assertValue<T>(value: T | undefined | null, errorMessage?: string): T {
  if (value === null || value === undefined) {
    throw new Error(errorMessage ?? 'Value was not provided!');
  }

  return value;
}

export const wait = async (delayInMs: number) => new Promise((res) => setTimeout(res, delayInMs));
