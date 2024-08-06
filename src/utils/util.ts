export function assertValue<T>(value: T | undefined | null, errorMessage?: string): T {
  if (value === null || value === undefined) {
    throw new Error(errorMessage ?? 'Value was not provided!');
  }

  return value;
}

export const wait = async (delayInMs: number) => new Promise((res) => setTimeout(res, delayInMs));

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  // Remove the leading # if present
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }

  // Check if the hex code is valid (3 or 6 characters long)
  if (hex.length !== 3 && hex.length !== 6) {
    return null;
  }

  // If the hex code is 3 characters long, convert it to 6 characters
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('');
  }

  // Parse the hex code into RGB values
  const num = parseInt(hex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  return { r, g, b };
};
