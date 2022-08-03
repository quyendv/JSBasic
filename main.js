// /* eslint-disable linebreak-style */
// /* eslint-disable indent */
// // alert('Hi Q');

// // setTimeout(() => {
// //   alert('Timeout da chay');
// // }, 1000);

// // setTimeout(() => {
// //   alert('Timeout da chay');
// // }, 1000);

// // const x = NaN;

// const res = 'A' && 'B' && 'c';
// console.log(res);
// console.log('OK');

// let greeting = 'hey hi';
// const times = 4;

// if (times > 3) {
//     greeting = "say 'Hello' 'world' instead";
// }

// console.log(greeting); // "say Hello instead"

// function name(a) {
//     console.log(a);
// }

// function name1(b) {
//     console.log(`b ${b}`);
// }

// name('a');

// console.log(12e-3);
// console.log(typeof NaN);
// console.log(typeof typeof 20 / 'abc');

// const arr = ['JS', 'PHP', 'C++'];
// const str = arr.join('');

// console.log(str);

// const name2 = 'James';
// const person = { first: name2 };
// console.log(person);
// const sayHelloLinting = fName => {
//     console.log(`Hello linting, ${fName}`);
// };

// let arr2 = [1, 11, 2, 3, 4, 5];
// arr2.sort();
// arr2.reverse();
// arr2.sort((a, b) => a - b);
// console.log(arr2);

// let obj = {
//     name: 'hello',
//     age: 20,
//     getName() {
//         return this.name;
//     },
//     getAge: function () {
//         return this.age;
//     },
// };

// console.log(obj.getName()); // chú ý nếu chỉ obj.getName nó k in ra tên mà chỉ [Function: getName]

// for (prop in obj) {
//     console.log(`${prop} : ${obj[prop]}`);
// }

// function sum(a, b, c) {
//     console.log(a, b, c);
// }

// sum(1, 2, 3, 4);

// function User(email, password) {
//     this.email = email;
//     this.password = password;
// }

let User = function (email, password) {
    this.email = email;
    this.password = password;
};

User.prototype.className = 'F8';
// eslint-disable-next-line no-restricted-syntax
User.prototype.getClassName = function () {
    return this.className;
    // return `${this.email} ${this.password}`;
};

let user = new User('abc@gmail.com', 'aoiwejaf');
console.log(user);
console.log(user.getClassName());

let x = 1;
let y = 2;
console.log(`x = ${x} & y = ${y}`);

x += y - (y = x);
console.log(`x = ${x} & y = ${y}`);
