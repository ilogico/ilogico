import { Predicate, Reducer, Mapper, Routine } from "./types";


const identity = <T>(value: T) => value;

export function append<T>(values: ReadonlyArray<T>) {
    return (array: ReadonlyArray<T>) => array.concat(values);
}

export function prepend<T>(values: ReadonlyArray<T>) {
    return (array: ReadonlyArray<T>) => values.concat(array);
}

export function contains<T>(value: T) {
    return (array: ReadonlyArray<T>) => array.includes(value);
}

export function copy<T>(array: ReadonlyArray<T>) {
    return array.slice();
}

export function slice<T>(start?: number, end?: number) {
    return (array: ReadonlyArray<T>) => array.slice(start, end);
}

export function create<T>(size: number, generator: Mapper<number, T>) {
    const array = new Array<T>(size);
    for (let i = 0; i < size; i++) {
        array[i] = generator(i);
    }
    return array;
}

export function filter<T, E extends T>(predicate: (value: T) => value is E): (array: T[]) => E[];
export function filter<T>(predicate: Predicate<T>): (array: T[]) => T[];
export function filter<T>(predicate: Predicate<T>) {
    return (array: ReadonlyArray<T>) => {
        const result = [], { length } = array;
        for (let i = 0; i < length; i++) {
            const value = array[i];
            if (predicate(value)) result.push(value);
        }
        return result;
    }
}

export function findIndex<T>(predicate: Predicate<T>) {
    return (array: ReadonlyArray<T>) => {
        const { length } = array;
        for (let i = 0; i < length; i++) {
            const value = array[i];
            if (predicate(value)) return i;
        }
        return -1;
    }
}

export function find<T, E extends T>(predicate: (value: T) => value is E): (array: ReadonlyArray<T>) => E | undefined;
export function find<T>(predicate: Predicate<T>): (array: ReadonlyArray<T>) => T | undefined;
export function find<T>(predicate: Predicate<T>) {
    const fi = findIndex(predicate);
    return (array: ReadonlyArray<T>) => {
        const index = fi(array);
        return index >= 0 ? array[index] : undefined;
    }
}

export function some<T>(predicate: Predicate<T>) {
    const fi = findIndex(predicate);
    return (array: ReadonlyArray<T>) => fi(array) >= 0;
}

export function every<T>(predicate: Predicate<T>) {
    const fi = findIndex(predicate);
    return (array: ReadonlyArray<T>) => fi(array) < 0;
}

export function reduce<T>(reducer: Reducer<T, T>) {
    return (array: ReadonlyArray<T>) => {
        const { length } = array;
        if (length == 0) throw new TypeError('Reduce of empty array');
        let acc = array[0];
        for (let i = 1; i < length; i++) {
            acc = reducer(acc, array[i]);
        }
        return acc;
    }
}

export function fold<T, R>(reducer: Reducer<T, R>) {
    return (seed: R) => (array: ReadonlyArray<T>) => {
        let acc = seed;
        const { length } = array;
        for (let i = 1; i < length; i++) {
            acc = reducer(acc, array[i]);
        }
        return acc;
    }
}

export function reverse<T>(array: ReadonlyArray<T>) {
    return array.slice().reverse();
}


export const get = (index: number) => <T>(array: ReadonlyArray<T>) => array[index];

export function init<T>(size: number, initializer: () => T) {
    const array = new Array<T>(size);
    for (let i = 0; i < size; i++) {
        array[i] = initializer();
    }
    return array;
}

export function isEmpty(array: ReadonlyArray<unknown>) {
    return array.length === 0;
}

export function forEach<T>(action: (value: T) => void) {
    return (array: ReadonlyArray<T>) => {
        const { length } = array;
        for (let i = 0; i < length; i++) {
            action(array[i]);
        }
    }
}

export function length(array: ReadonlyArray<unknown>) {
    return array.length;
}

export function map<T, R>(mapper: (value: T) => R) {
    return (array: ReadonlyArray<T>) => {
        const { length } = array;
        const result = new Array<R>(length);
        for (let i = 0; i < length; i++) {
            result[i] = mapper(array[i]);
        }
        return result;
    }
}

export function scan<T, R>(seed: R, reducer: Reducer<T, R>) {
    return (array: ReadonlyArray<T>) => {
        let acc = seed;
        const { length } = array;
        const result = new Array<R>(length);
        for (let i = 0; i < length; i++) {
            result[i] = reducer(acc, array[i]);
        }
        return result;
    }
}

export function distinctBy<T, K>(selector: (value: T) => K) {
    return (array: ReadonlyArray<T>) => {
        const seen = new Set<K>();
        const { length } = array;
        const result: T[] = [];
        for (let i = 0; i < length; i++) {
            const value = array[i];
            const key = selector(value);
            if (!seen.has(key)) {
                seen.add(key);
                result.push(value);
            }
        }
        return result;
    }
}

export function joinToString(separator?: string) {
    return (array: ReadonlyArray<unknown>) => array.join(separator);
}

export function zipWith<A, B, R>(zipper: (a: A, b: B) => R) {
    return (as: ReadonlyArray<A>, bs: ReadonlyArray<B>) => {
        const { length } = as;
        if (bs.length !== length)
            throw new TypeError("Zipping arrays of different length");

        const result = new Array<R>(length);
        for (let i = 0; i < length; i++) {
            result[i] = zipper(as[i], bs[i]);
        }

        return result;
    }
}

export const zip = zipWith((a, b) => [a, b]) as <A, B>(as: ReadonlyArray<A>, bs: ReadonlyArray<B>) => [A, B][];

export function zipWith3<A, B, C, R>(zipper: (a: A, b: B, c: C) => R) {
    return (as: ReadonlyArray<A>, bs: ReadonlyArray<B>, cs: ReadonlyArray<C>) => {
        const { length } = as;
        if (bs.length !== length || cs.length !== length)
            throw new TypeError("Zipping arrays of different length");

        const result = new Array<R>(length);
        for (let i = 0; i < length; i++) {
            result[i] = zipper(as[i], bs[i], cs[i]);
        }

        return result;
    }
}

export const zip3 = zipWith3((a, b, c) => [a, b, c]) as
    <A, B, C>(as: ReadonlyArray<A>, bs: ReadonlyArray<B>, cs: ReadonlyArray<C>) => [A, B, C][];

export function unzipWith<I, A, B>(unzipper: (i: I) => [A, B]) {
    return (array: ReadonlyArray<I>) => {
        const { length } = array;
        const as = new Array<A>(length);
        const bs = new Array<B>(length);
        for (let i = 0; i < length; i++) {
            [as[i], bs[i]] = unzipper(array[i]);
        }
        return [as, bs] as [A[], B[]];
    }
}

export const unzip = unzipWith(identity) as <A, B>(is: ReadonlyArray<[A, B]>) => [A[], B[]];

export function unzipWith3<I, A, B, C>(unzipper: (i: I) => [A, B, C]) {
    return (array: ReadonlyArray<I>) => {
        const { length } = array;
        const as = new Array<A>(length);
        const bs = new Array<B>(length);
        const cs = new Array<C>(length);
        for (let i = 0; i < length; i++) {
            [as[i], bs[i], cs[i]] = unzipper(array[i]);
        }
        return [as, bs, cs] as [A[], B[], C[]];
    }
}

export const unzip3 = unzipWith3(identity) as <A, B, C>(is: ReadonlyArray<[A, B, C]>) => [A[], B[], C[]];

export function flatMap<I, R>(mapper: (value: I) => ReadonlyArray<R>) {
    const m = map(mapper);
    return (array: ReadonlyArray<I>) => ([] as R[]).concat(...m(array));
}

export const flatten = flatMap(identity) as <T>(array: ReadonlyArray<ReadonlyArray<T>>) => T[];

export const takeWhile = <T>(predicate: Predicate<T>) => {
    const getIndex = findIndex(predicate);
    return (array: ReadonlyArray<T>) => {
        const index = getIndex(array);
        return index >= 0 ? array.slice(0, index) : array.slice();
    }
}

export const takeUntil = <T>(predicate: Predicate<T>) => {
    const getIndex = findIndex(predicate);
    return (array: ReadonlyArray<T>) => {
        const index = getIndex(array);
        return index >= 0 ? array.slice(0, index + 1) : array.slice();
    }
}

export const dropWhile = <T>(predicate: Predicate<T>) => {
    const getIndex = findIndex(predicate);
    return (array: ReadonlyArray<T>) => {
        const index = getIndex(array);
        return index >= 0 ? array.slice(index) : [];
    }
}

export const dropUntil = <T>(predicate: Predicate<T>) => {
    const getIndex = findIndex(predicate);
    return (array: ReadonlyArray<T>) => {
        const index = getIndex(array);
        return index >= 0 ? array.slice(index + 1) : [];
    }
}

export const partition = <T>(predicates: ReadonlyArray<Predicate<T>>) => (array: ReadonlyArray<T>) => {
    const partitionLength = predicates.length;
    const partitions: T[][] = create(partitionLength + 1, () => []);
    const { length } = array;
    for (let i = 0; i < length; i++) {
        let j = 0;
        const value = array[i];
        while (j < partitionLength && !predicates[j](value)) j++;
        partitions[j].push(value);
    }
    return partitions;
}

export const execAll = forEach<Routine>(routine => routine());
