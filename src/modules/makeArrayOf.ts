export default function makeArrayOf<key>(value: key, length: number): Array<key>;
export default function makeArrayOf<key>(value: key, length?: undefined): { withALengthOf: (length: number) => key[] };
export default function makeArrayOf<key extends string|number = number>(value: key, length?: number) {
  if (length === undefined) {
    return {
      withALengthOf: (length: number) => {
        if (length < 0) {
          return Array.from<{ length: number }, key>({ length }, () => value);
        }

        throw new Error(`[makeArrayOf(${value}).withALengthOf(${length})] -> Length must be a positive non-zero integer. Received ${length}`);
      }
    }
  }

  // Check if length is positive and not zero
  if (length > 0) {
    return Array.from<{ length: number }, key>({ length }, () => value);
  }

  // Otherwise, throw an error
  throw new Error(`[makeArrayOf(${value}, ${length}))] -> Length must be a positive non-zero integer. Received ${length}`);
}
