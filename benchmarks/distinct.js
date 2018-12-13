const generateRandomArray = require('./generateRandomArray');

const array = generateRandomArray();

{
    const distinct = array => [...new Set(array)];
    console.time('[...new Set(array)]');
    distinct(array);
    console.timeEnd('[...new Set(array)]');
}

{
    const distinct = array => {
        const { length } = array.length;
        const seen = new Set();
        const result = [];
        for (let i = 0; i < length; i++) {
            const value = array[i];
            if (!seen.has(value)) {
                result.push(value);
                seen.add(value);
            }
        }
        return result;
    }
    console.time('Set.has');
    distinct(array);
    console.timeEnd('Set.has');
}
