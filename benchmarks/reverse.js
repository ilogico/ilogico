const generateRandomArray = require('./generateRandomArray');

const array = generateRandomArray(10000000);


(() => {
    const reverse = array => array.slice().reverse();
    console.time('array.slice.reverse');
    reverse(array);
    console.timeEnd('array.slice.reverse');
})();

(() => {
    const reverse = array => {
        const result = [];
        for (let i = array.length - 1; i >= 0; i--) {
            result.push(array[i])
        }
        return result;
    }
    console.time('push');
    reverse(array);
    console.timeEnd('push');
})();

(() => {
    const reverse = array => {
        const { length } = array;
        const result = new Array(length);
        for (let i = 0; i < length; i++) {
            result[length - 1 - i] = array[i];
        }
        return result;
    }
    console.time('assign');
    reverse(array);
    console.timeEnd('assign');
})();

