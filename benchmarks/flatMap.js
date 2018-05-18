const generateRandomArray = require('./generateRandomArray');

const lengths = generateRandomArray(10000).map(x => x * 10000);
const mapper = generateRandomArray;

(() => {
    const flatMap = mapper => array => {
        const result = [];
        const { length } = array;
        for (let i = 0; i < length; i++) {
            result.push(...mapper(array[i]));
        }
        return result;
    }
    const test = flatMap(mapper);
    console.time('push');
    test(lengths);
    console.timeEnd('push');
})();

(() => {
    const flatMap = mapper => array => {
        const result = [];
        const { length } = array;
        for (let i = 0; i < length; i++) {
            const temp = mapper(array[i]);
            const { length: tempLength } = temp;
            for (let j = 0; j < tempLength; j++) {
                result.push(temp[j]);
            }
        }
       return result;
    }
    const test = flatMap(mapper);
    console.time('inner loop');
    test(lengths);
    console.timeEnd('inner loop');
})();

(() => {
    const flatMap = mapper => array => {
        const result = [];
        const { length } = array;
        let size = 0;
        for (let i = 0; i < length; i++) {
            const temp = mapper(array[i]);
            const { length: tempLength } = temp;
            for (let j = 0; j < tempLength; j++) {
                result[size++] = temp[j];
            }
        }
       return result;
    }
    const test = flatMap(mapper);
    console.time('inner loop assign');
    test(lengths);
    console.timeEnd('inner loop assign');
})();

