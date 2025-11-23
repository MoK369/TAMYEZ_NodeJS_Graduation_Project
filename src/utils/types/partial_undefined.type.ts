export type PartialUndefined<T> = {
  [P in keyof T]?: T[P] | undefined;
};
