import { Compare } from "./types";
import insertSort from "./insertSort";

export default <T>(compare: Compare<T>) => {
    const is = insertSort(compare);

    const qs = (array: T[], start: number, end: number) => {
        const length = end - start;
        if (length < 16) {
            is(array, start, end);
            return;
        }

        const third = length / 3 | 0;

        let i0 = start + third;
        let i1 = i0 + third;
        const lastIndex = end - 1;

        let pivot0 = array[i0], pivot1 = array[i1];
        array[i0] = array[start];
        array[i1] = array[lastIndex];

        {
            const comparison = compare(pivot0, pivot1);
            if (comparison > 0) {
                [pivot0, pivot1] = [pivot1, pivot0];
            } else if (comparison === 0) {
                qse(array, start, end, pivot0, pivot1);
                return;
            }
        }

        i0 = start;
        i1 = lastIndex;
        let idx = start + 1;
        while (idx < i1) {
            const value = array[idx];
            if (compare(value, pivot1) > 0) {
                array[i1] = value;
                array[idx] = array[--i1];
            } else {
                if (compare(value, pivot0) < 0) {
                    array[i0] = value;
                    array[idx] = array[++i0];
                }
                idx++;
            }
        }
        
        array[i0] = pivot0;
        array[i1] = pivot1;
        qs(array, start, i0);
        qs(array, i0 + 1, i1);
        qs(array, i1 + 1, end);
    }

    const qse = (array: T[], start: number, end: number, pivot0: T, pivot1: T) => {
        let i0 = start, i1 = end - 1, idx = i0 + 1;

        while (idx < i1) {
            const value = array[idx];
            const comparison = compare(value, pivot0);
            if (comparison > 0) {
                array[i1] = value;
                array[idx] = array[--i1];
            } else {
                if (comparison < 0) {
                    array[i0] = value;
                    array[idx] = array[++i0];
                }
                idx++;
            }
        }
        
        array[i0] = pivot0;
        array[i1] = pivot1;
        qs(array, start, i0);
        qs(array, i1 + 1, end);
    }

    return (array: T[]) => {
        qs(array, 0, array.length);
    }
}
