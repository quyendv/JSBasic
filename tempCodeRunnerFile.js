let x = 1;
let y = 2;
console.log(`x = ${x} & y = ${y}`);

x += y - (y = x);
console.log(`x = ${x} & y = ${y}`);
