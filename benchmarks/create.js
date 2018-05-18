const Size = 1000000;
const initializer = () => ({ value: 42 });

(() => {
    console.time('push');
    const r = [];
    for (let i = 0; i < Size; i++) {
        r.push(initializer);
    }
    console.timeEnd('push');
})();

(() => {
    console.time('assign');
    const r = [];
    for (let i = 0; i < Size; i++) {
        r[i] = initializer;
    }
    console.timeEnd('assign');
})();

(() => {
    console.time('prealloc');
    const r = new Array(Size);
    for (let i = Size - 1; i >= 0; i--) {
        r[i] = initializer;
    }
    console.timeEnd('prealloc');
})();

(() => {
    const generator = function * () {
        for (let i = 0; i < Size; i++) {
            yield initializer;
        }
    }

    console.time('generator');
    Array.from(generator());
    console.timeEnd('generator');
})();
