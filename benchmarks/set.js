const generateRandomArray = require('./generateRandomArray')
const set = new Set(generateRandomArray(1000000));
const action = v => v === v;


{
    const forEach = action => set => { set.forEach(action); }
    console.time('forEach');
    forEach(action)(set)
    console.timeEnd('forEach');
}

{
    const arrayForEach = action => set => {
        const array = [...set];
        const { length } = array;
        for (let i = 0; i < length; i++) action(array[i]);
    }
    console.time('arrayForEach');
    arrayForEach(action)(set)
    console.timeEnd('arrayForEach');
}

{
    const iteratorAndArray = action => set => {
        const length = set.size;
        const array = new Array(length);
        let i = 0;
        for (const value of set) array[i++] = value;
        for (i = 0; i < length; i++) action(array[i]);
    }
    console.time('iteratorAndArray');
    iteratorAndArray(action)(set)
    console.timeEnd('iteratorAndArray');
}

{
    const iterator = action => set => {
        for (const value of set) action(value);
    }
    console.time('iterator');
    iterator(action)(set)
    console.timeEnd('iterator');
}

{
    const cloneIterator = action => set => {
        for (const value of new Set(set)) action(value);
    }
    console.time('cloneIterator');
    cloneIterator(action)(set)
    console.timeEnd('cloneIterator');
}