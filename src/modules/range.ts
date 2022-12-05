export default function* range(start: number, end: number, step = 1): Generator<number> {
  // Check if the step value is negative, and if so, swap the start and end values
  if (step < 0) {
    [start, end] = [end, start];
  }

  for (let i: number = start; i <= end; i += step) {
    yield i;
  }
}
