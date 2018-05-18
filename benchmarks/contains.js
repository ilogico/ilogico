const generateRandomArray = require('./generateRandomArray');

const array = generateRandomArray(1000000);

(() => {
    const includes = (array, value) => array.includes(value);
    console.time('includes');
    includes(array, 0.5);
    console.timeEnd('includes')
})();

(() => {
    const includes = value => array => array.includes(value);
    const includesValue = includes(0.5);
    console.time('curried includes');
    includesValue(array);
    console.timeEnd('curried includes')
})();

(() => {
    const contains = (array, value) => {
        const { length } = array;
        for (let i = 0; i < length; i++) {
            if (Object.is(value, array[i])) {
                return true;
            }
        }
        return false;
    };
    console.time('contains');
    contains(array, 0.5);
    console.timeEnd('contains')
})();


(() => {
    const some = (array, pred) => array.some(pred);
    console.time('some');
    some(array, value => Object.is(value, 0.5));
    console.timeEnd('some')
})();

(() => {
    const customSome = (array, pred) => {
        const { length } = array;
        for (let i = 0; i < length; i++) {
            if (pred(array[i])) {
                return true;
            }
        }
        return false;
    };
    console.time('customSome');
    customSome(array, value => Object.is(value, 0.5));
    console.timeEnd('customSome')
})();

(() => {
    const curriedSome = pred => array => {
        const { length } = array;
        for (let i = 0; i < length; i++) {
            if (pred(array[i])) {
                return true;
            }
        }
        return false;
    };
    const someValue = curriedSome(value => Object.is(value, 0.5))
    console.time('curriedSome');
    someValue(array);
    console.timeEnd('curriedSome')
})();


(() => {
    const contains = pred => array => {
        const { length } = array;
        for (let i = 0; i < length; i++) {
            if (pred(array[i])) {
                return true;
            }
        }
        return false;
    };
    const containsValue = contains(x => Object.is(x, 0.5));
    console.time('curried contains');
    containsValue(array);
    console.timeEnd('curried contains')
})();
