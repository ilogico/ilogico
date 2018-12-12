import { Compare } from "./types";

export default <T>(compare: Compare<T>) => (array: T[], start: number, end: number) => {
    for (let i = start + 1; i < end; i++) {
        const value = array[i];
        let j = i - 1;
        while (j >= start && compare(array[j], value) > 0) {
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = value;
    }
}
