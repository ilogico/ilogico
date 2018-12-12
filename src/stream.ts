import * as event from "./event";
import { Mapper, Predicate, Seed, Reducer } from "./types";
import * as array from './array';

export interface Stream<T> {
    onData: event.Subscribe<T>;
    onComplete: event.Subscribe<void>;
    onError: event.Subscribe<unknown>;
}


export const map = <T, R>(mapper: Mapper<T, R>) => {
    const adapt = event.map(mapper);
    return (stream: Stream<T>): Stream<R> => ({
        ...stream,
        onData: adapt(stream.onData)
    });
};

export const filter = <T>(predicate: Predicate<T>) => {
    const adapt = event.filter(predicate);
    return (stream: Stream<T>): Stream<T> => ({
        ...stream,
        onData: adapt(stream.onData)
    });
};

export function reduce<E, R>(reducer: Reducer<E, R>) {
    return (seed: R) => (stream: Stream<E>) => new Promise<R>((accept, reject) => {
        let acc = seed;
        const subscriptions = [
            stream.onComplete(() => {
                accept(acc);
                array.execAll(subscriptions);
            }),
            stream.onError(error => {
                reject(error);
                array.execAll(subscriptions);
            }),
            stream.onData(value => {
                acc = reducer(acc, value);
            }),
        ];
    })
}


