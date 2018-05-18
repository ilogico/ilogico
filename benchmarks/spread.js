const array = [];

for (let i = 0; i < 100000; i++) {
    array.push(Math.random());
}


(() => {
    console.time('slice');
    for (let i = 0; i < 100; i++) {
        const result = array.slice();
        result.push(Math.random());
    }
    console.timeEnd('slice');
})();

(() => {
    console.time('spread');
    for (let i = 0; i < 100; i++) {
        const result = [... array, Math.random()];
    }
    console.timeEnd('spread');
})();

(() => {
    console.time('concat');
    for (let i = 0; i < 100; i++) {
        const result = array.concat([Math.random()]);
    }
    console.timeEnd('concat');
})();
