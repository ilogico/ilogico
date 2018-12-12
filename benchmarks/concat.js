const generateRandomArray = require('./generateRandomArray');

const arrays = [
    generateRandomArray(),
    generateRandomArray(),
    generateRandomArray(),
];

(() => {
    const concat = (...arrays) => [].concat(...arrays);
    console.time('[].concat');
    concat(...arrays);
    console.timeEnd('[].concat');
})();

(() => {
    const concat = (...arrays) => {
        const result = [];
        const arrayCount = arrays.length;
        for (let i = 0; i < arrayCount; i++) {
            const currentArray = arrays[i];
            const { length } = currentArray;
            for (let j = 0; j < length; j++) {
                result.push(currentArray[j]);
            }
        }
        return result;
    }
    
    console.time('inner loop');
    concat(...arrays);
    console.timeEnd('inner loop');
})();
