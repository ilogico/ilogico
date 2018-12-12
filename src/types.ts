export type Compare<T> = (a: T, b: T) => number;
export type Mapper<T, R> = (value: T) => R;
export type Predicate<T> = (value: T) => unknown;
export type Action<T> = (value: T) => void;
export type Routine = () => void;
export type Reducer<T, R> = (acc: R, value: T) => R;
export type Seed<T> = () => T;

export type Argument<F extends (val: any) => any> = F extends (arg: infer A) => any ? A : never;

export type Depencencies<T extends ((val: any) => unknown)[]> = T extends ((arg: infer A) => any)[]
    ? A
    : never;

