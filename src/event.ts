import { Predicate, Action, Routine, Mapper, Reducer, Seed } from './types';
import * as array from "./array";
import { bind, pipe } from './function';


export type Subscribe<T> = (subscriber: Action<T>) => Routine;


const adapt = <T, R = T>(adapter: (action: Action<R>) => Action<T>) =>
    (subscribe: Subscribe<T>): Subscribe<R> => action => subscribe(adapter(action));

export const map = <T, R>(mapper: Mapper<T, R>) => adapt<T, R>(next => value => next(mapper(value)));

export const filter = <T>(predicate: Predicate<T>) => adapt<T>(next => value => {
    if (predicate(value)) next(value);
});

export const merge = <T>(...subscribeList: Subscribe<T>[]): Subscribe<T> => action => {
    const cancelations = array.map<Subscribe<T>, Routine>(s => s(v => action(v)))(subscribeList);
    return bind(cancelations, array.execAll);
}

export const takeWhile = <T>(predicate: Predicate<T>) => (subscribe: Subscribe<T>): Subscribe<T> => next => {
    const cancel = subscribe(value => {
        if (predicate(value)) next(value);
        else cancel();
    });
    return cancel;
}

export const takeUntil = <T>(predicate: Predicate<T>) => (subscribe: Subscribe<T>): Subscribe<T> => next => {
    const cancel = subscribe(value => {
        next(value);
        if (predicate(value)) cancel();
    });
    return cancel;
}

export const dropWhile = <T>(predicate: Predicate<T>) => (subscribe: Subscribe<T>): Subscribe<T> => next => {
    let cancel = subscribe(value => {
        if (predicate(value)) {
            cancel();
            cancel = subscribe(next);
            next(value);
        }
    });
    return () => cancel();
}

export const dropUntil = <T>(predicate: Predicate<T>) => (subscribe: Subscribe<T>): Subscribe<T> => next => {
    let cancel = subscribe(value => {
        if (predicate(value)) {
            cancel();
            cancel = subscribe(next);
        }
    });
    return () => cancel();
}

export const throttle = (milliseconds: number) => <T>(subscribe: Subscribe<T>): Subscribe<T> => next => {
    let timer: number | null = null;
    let lastValue: T | undefined;
    let lastSend = 0;
    const deferred = () => {
        timer = null;
        const value = lastValue!;
        lastValue = undefined;
        next(value);
    };
    return subscribe(value => {
        if (timer !== null) {
            lastValue = value;
        } else {
            const now = Date.now();
            const delay = lastSend + milliseconds - now;
            if (delay < 0) {
                lastSend = now;
                next(value);
            } else {
                timer = setTimeout(deferred, delay);
                lastValue = value;
            }
        }
    });
}

export const debounce = (milliseconds: number) => <T>(subscribe: Subscribe<T>): Subscribe<T> => next => {
    let timer: number | null = null;
    let lastValue: T | undefined;
    const deferred = () => {
        timer = null;
        const value = lastValue!;
        lastValue = undefined;
        next(value);
    };
    return subscribe(value => {
        lastValue = value;
        if (timer !== null) clearTimeout(timer);
        timer = setTimeout(deferred, milliseconds);
    });
}

export const scan = <T, R>(reducer: Reducer<T, R>) => (seed: R) => (subscribe: Subscribe<T>): Subscribe<R> => next => {
    let acc = seed;
    return subscribe(value => {
        acc = reducer(acc, value);
        next(acc);
    });
}

export const combine = <T extends object>(seed: T) => (observable: { [K in keyof T]: Subscribe<T[K]> }): Subscribe<T> => next => {
    let acc = seed;
    const subscriptions: Routine[] = [];
    for (const key in observable) {
        subscriptions.push(observable[key](value => {
            acc = { ...acc as any, [key]: value }
            next(acc);
        }));
    }

    return bind(subscriptions, array.execAll);
}

export const publish = <T>(subscribe: Subscribe<T>): Subscribe<T> => {
    const subscribers = new Set<Action<T>>();
    const action = (value: T) => {
        const length = subscribers.size;
        const actions = new Array<Action<T>>(length);
        let i = 0;
        for (const action of subscribers) actions[i++] = action;
        for (i = 0; i < length; i++) actions[i](value);
    }
    let cancel: Routine | undefined;
    return next => {
        subscribers.add(next);
        if (subscribers.size === 0) cancel = subscribe(action);
        return () => {
            subscribers.delete(next);
            if (subscribers.size === 0) {
                cancel!();
                cancel = undefined;
            }
        }
    }
}

export function forEach<E>(action: Action<E>) {
    return (subscribe: Subscribe<E>) => {
        subscribe(action);
    };
}
