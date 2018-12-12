const generateRandomArray = require('./generateRandomArray');

const lengths = generateRandomArray(10000).map(x => x * 1000);
const mapper = generateRandomArray;

{
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
}

{
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
}
{
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
}

{
    const flatMap = mapper => array => {
        return array.flatMap(mapper);
    }
    const test = flatMap(mapper);
    console.time('[].flatMap');
    test(lengths);
    console.timeEnd('[].flatMap');
}

{
    const map = mapper => array => {
        const { length } = array;
        const result = new Array(length);
        for (let i = 0; i < length; i++) {
            result[i] = mapper(array[i]);
        }
        return result;
    }

    const flatMap = mapper => {
        const m = map(mapper);
        return array => [].concat(...m(array));
    };

    const test = flatMap(mapper);
    console.time('map and concat');
    test(lengths);
    console.timeEnd('map and concat');
}
