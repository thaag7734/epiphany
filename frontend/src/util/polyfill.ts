declare global {
  interface Set<T> {
    intersection(other: Set<T>): Set<T>;
  }
}

Set.prototype.intersection = function <T>(this: Set<T>, other: Set<T>): Set<T> {
  return new Set([...this].filter((item) => other.has(item)));
};
