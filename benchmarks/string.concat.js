const N = 100000;
(() => {
    const append = a => b => `${a}${b}`;
    const op = append('a');
    console.time('``');
    for (let i = 0; i < N; i++) {
        op('b');
    }
    console.timeEnd('``');
})();
(() => {
    const append = a => b => a + b;
    const op = append('a');
    console.time('+');
    for (let i = 0; i < N; i++) {
        op('b');
    }
    console.timeEnd('+');
})();


