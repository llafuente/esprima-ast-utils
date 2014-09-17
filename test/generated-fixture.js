function A(arg_a) {
    return 1;
}
function B(arg_b, stop) {
    if (arg_b > 5) {
        arg_b = arg_b / 10;
        return B(arg_b);
    }
    return arg_b;
}
module.exports = {
    B: B,
    A: A
};