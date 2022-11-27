export default function makeArrayOf<key>(value: key, length: number): Array<key>;
export default function makeArrayOf<key>(value: key, length?: undefined): { withALengthOf: (length: number) => key[] };
export default function makeArrayOf<key>(value: key, length?: number) {
  if (length) {
    return Array.from({ length }, () => value);
  }

  return {
    withALengthOf: (length: number) => {
      return Array.from({ length }, () => value);
    }
  }
}
