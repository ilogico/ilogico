const generateRandomArray = require('./generateRandomArray');

const array = generateRandomArray(10000000);


(() => {
    const filter = pred => array => array.filter(pred);
    const myFilter = filter(n => n < 0.5);
    console.time('array.filter');
    myFilter(array);
    console.timeEnd('array.filter');
})();

(() => {
    const filter = pred => array => {
        const { length } = array.length;
        const result = [];
        for (let i = 0; i < length; i++) {
            const value = array[i];
            if (pred(value)) result.push(value);
        }
        return result;
    }
    const myFilter = filter(n => n < 0.5);
    console.time('push');
    myFilter(array);
    console.timeEnd('push');
})();


(() => {
    const filter = pred => array => {
        const { length } = array.length;
        const result = [];
        for (let i = 0; i < length; i++) {
            const value = array[i];
            if (pred(value)) result[result.length] = value;
        }
        return result;
    }
    const myFilter = filter(n => n < 0.5);
    console.time('assign');
    myFilter(array);
    console.timeEnd('assign');
})();

(() => {
    const filter = pred => array => {
        const { length } = array.length;
        const result = [];
        for (let i = 0, l = 0; i < length; i++) {
            const value = array[i];
            if (pred(value)) result[l++] = value;
        }
        return result;
    }
    const myFilter = filter(n => n < 0.5);
    console.time('assign (without .length)');
    myFilter(array);
    console.timeEnd('assign (without .length)');
})();
