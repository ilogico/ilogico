import { Mapper } from "./types";

export const bind = <T, R>(value: T, func: (value: T) => R) => () => func(value);
export const compose = <A, B, C>(f: Mapper<B, C>, g: Mapper<A, B>) => (value: A) => f(g(value));

class Pipe<T, R> {
    apply: Mapper<T, R>;
    constructor(apply: Mapper<T, R>) {
        this.apply = apply;
    }

    to<N>(mapper: Mapper<R, N>) {
        return new Pipe(compose(mapper, this.apply));
    }
}

const initialPipe = Object.freeze({
    to<T>(mapper: Mapper<any, any>) {
        return new Pipe(mapper);
    }
});

export interface InitialPipe<T> {
    to<R>(mapper: Mapper<T, R>): Pipe<T, R>;
}

export function pipe<T>(): InitialPipe<T>;
export function pipe<T, R>(mapper: Mapper<T, R>): Pipe<T, R>;
export function pipe<T, R>(mapper?: Mapper<T, R>) {
    return mapper === undefined ? initialPipe : new Pipe(mapper);
}