import { Compare } from './types';

export default <T>(compare: Compare<T>) => {

    const bubbleDown = (array: T[], index: number) => {
        const value = array[index];
        let parent: T, parentIndex: number;
        while (index > 0 && compare(value, parent = array[parentIndex = (index - 1) >> 1])) {
            array[index] = parent;
            index = parentIndex;
        }
        array[index] = value;
    }

    const bubbleUp = (array: T[]) => {
        let index = 0;
        const value = array[0];
        const { length } = array;
        
        let leftIndex = index << 1;
        let rightIndex = leftIndex + 1;
        while (rightIndex < length) {
            const left = array[leftIndex];
            const right = array[rightIndex];
            
            const [candidateIndex, candidate] = compare(left, right) > 0
                ? [leftIndex, left]
                : [rightIndex, right];
            
            if (compare(value, candidate) <= 0) {
                array[index] = value;
                return;
            }
            
            array[index] = candidate;
            index = candidateIndex;
            leftIndex = index << 1;
            rightIndex = leftIndex + 1;
        }

        if (leftIndex < length) {
            const left = array[leftIndex];
            if (compare(value, left) > 0) {
                array[index] = left;
                index = leftIndex;
            }
        }

        array[index] = value;
    }

    const heapify = (array: T[]) => {
        const { length } = array;
        for (let i = 1; i < length; i++) bubbleDown(array, i);
    }

    const push = (array: T[], value: T) => {
        const { length } = array;
        array[length] = value;
        bubbleDown(array, length);
    }

    const pop = (array: T[]) => {
        const last = array.pop();
        const { length } = array;
        if (!length) {
            return last;
        }

        const result = array[0];
        array[0] = last!;
        bubbleUp(array);
        return result;
    }
}
