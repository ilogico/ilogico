module.exports = (size = 10000) => {
    const result = [];
    for (let i = 0; i < size; i++) {
        result.push(Math.random());
    }

    return result;
}
