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

// let User = function (email, password) {
//     this.email = email;
//     this.password = password;
// };

// User.prototype.className = 'F8';
// // eslint-disable-next-line no-restricted-syntax
// User.prototype.getClassName = function () {
//     return this.className;
//     // return `${this.email} ${this.password}`;
// };

// let user = new User('abc@gmail.com', 'aoiwejaf');
// console.log(user);
// console.log(user.getClassName());

// let x = 1;
// let y = 2;
// console.log(`x = ${x} & y = ${y}`);

// x += y - (y = x);
// console.log(`x = ${x} & y = ${y}`);

// let depthArr = [1, 2, [3, 4], 5, [6, 7], 8];
// // eslint-disable-next-line no-restricted-syntax
// let flatArr = depthArr.reduce(function (flatOutput, depthElement) {
//     return flatOutput.concat(depthElement);
// }, []);

// console.log(flatArr);

// console.log({ ...['a', 'b', 'c'] });

// let arr = ['a', 'b', 'c'];
// console.log(arr[-1]);
// console.log('string'[-1]);

// document.onkeyup = function (e) {
//     console.log(e.which);
// };

// let links = document.querySelectorAll('a');
// links.forEach(link => {
//     link.onclick = e => {
//         if (!e.target.href.startsWith('https://f8.edu.vn')) {
//             e.preventDefault();
//         }
//     };
// });

// function sleep(ms) {
//     return new Promise(function (resolve) {
//         setTimeout(resolve, ms);
//     });
// }

// sleep(1000)
//     .then(function () {
//         console.log(1);
//         return sleep(1000);
//     })
//     .then(function () {
//         console.log(2);
//         return sleep(1000);
//     })
//     .then(function () {
//         console.log(3);
//         return sleep(1000);
//     })
//     .then(function () {
//         console.log(4);
//         return sleep(1000);
//     });

// const sleep = ms =>
//     new Promise(resolve => {
//         setTimeout(resolve, ms);
//     });

// let a1 = [1];
// let a2 = [2, 3];
// let a3 = [...a1, ...a2];
// a1.concat(a2); // dòng code vô nghĩa, concat k thay đổi mảng tồn tại, chỉ trả về mảng mới thôi
// a1.push(...a2);
// console.log(a3);
// console.log(a1);
// console.log(typeof [...[1, 2, 3, 4, 5]]);
// console.log(a1 === a3); // đều compare địa chỉ, luôn false, chỉ có duyệt từng element so sánh thôi
// console.log(Object.is(a1, a3)); // đều compare địa chỉ, luôn false, chỉ có duyệt từng element so sánh thôi

/**
 * Fake API: Ta sẽ thực hiện in thử ra trang web "Tên người cmt: Nội dung cmt của người đó"
 * -> Ở đây ta chỉ mô phỏng bằng 2 mảng users và comments nên lấy chỉ việc return :D, nhưng thực tế sẽ là trên database sẽ phức tạp hơn, và chắc chắn phải dùng promise cho các tác vụ API như vậy
 * 1. Lấy array comments, sau đó lấy ra userIds của những người cmt bằng map (chỉ id thôi nên dùng map, filter để lấy cả đối tượng cơ)
 * 2. Từ userIds trên ta lấy ra danh sách các user trong array users (lấy toàn bộ đối tượng từ id, name, ... nhé chứ k phải chỉ có name)
 * 3. Sau khi lấy được thông tin các usersComment ta sẽ trả về 1 đối tượng chứa thông tin user và cmt của người đó: {users: usersComment, comments: comments}
 * 4. Từ Object trên, ta tạo ra 1 string or array.join('') chứa các thẻ li dạng user: cmt của user đó rồi đưa vào 1 thẻ ul bằng innerHTML
 */

// let users = [
//     {
//         id: 1,
//         name: 'Nguyễn Văn A',
//     },
//     {
//         id: 2,
//         name: 'Sơn Đặng',
//     },
//     {
//         id: 3,
//         name: 'Trần Văn B',
//     },
//     // ...
// ];

// let comments = [
//     {
//         id: 1, // id của comment, có thể theo thứ tự comment
//         user_id: 1,
//         content: 'Anh Sơn chưa ra video :(',
//     },
//     {
//         id: 2,
//         user_id: 2,
//         content: 'Vừa ra xong em ơi!',
//     },
//     {
//         id: 3,
//         user_id: 1,
//         content: 'Cám ơn anh^^',
//     },
// ];

// /*
//     Hàm này có nhiệm vụ lấy ra comments, vì là API nên sẽ dùng bất đồng bộ, dùng setTimeout vì tình trạng mạng có thể nhanh chậm khác nhau.
//     Ở đây ta chỉ đang mô phỏng bằng 1 mảng comments nhưng thực tế nó là ở database, truy vấn phức tạp hơn, và buộc dùng promise cho API nhé
// */
// function getComments() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(comments);
//         }, 1000);
//     });
// }

// /*
//     Lần gọi này sẽ lấy ra thông tin user(name, id, ...) và comment của người đó
// */
// getComments()
//     .then(comments => {
//         // console.log(comments);  // clg xem thử
//         let userIds = comments.map(cmt => cmt.user_id);

//         return getUserByIds(userIds)
//             .then(usersComment => ({
//                 users: usersComment,
//                 comments: comments,
//             }))
//             .then(data => {
//                 // console.log(data);
//                 let commentBlock = document.querySelector('ul.comment-block');
//                 let html = '';

//                 // ở đây có thể for cho users và find cho comments nhé, chỉ là tìm id tương ứng giữa 2 cái rồi cho thông tin vào li thôi
//                 data.comments.forEach(cmt => {
//                     let userForThisCmt = data.users.find(
//                         user => user.id === cmt.user_id
//                     );
//                     html += `<li>${userForThisCmt.name}: ${cmt.content}</li>`;
//                 });
//                 console.log(html);
//                 commentBlock.innerHTML = html;
//             });
//     })
//     .catch(error => {
//         console.log(error.message);
//     });

// /*
//  *   Hàm này dùng cho hàm getComments bên trên, để dưới cũng đc vì tính chất hoisting nhưng chỉ áp dụng cho declaration function thôi
//  *   Truyền vào danh sách user_ids trong comment và trả về các user có id trong user_ids đó
//  *   Ở đây ta lấy trực tiếp mảng users ở bên trên, tuy nhiên thực tế là ở database nên phải dùng promise nhé
//  */
// function getUserByIds(userIds) {
//     return new Promise((resolve, reject) => {
//         // Có 1 bước get users từ database ra để dùng cho code bên dưới nhé

//         // danh sách user có trong user_id của comments
//         let result = users.filter(user => userIds.includes(user.id));
//         setTimeout(() => {
//             resolve(result);
//         }, 1000);
//     });
// }

// let postAPI = 'https://jsonplaceholder.typicode.com/posts';
// /**
//  * Phương thức fetch() trả về một promise có trạng thái resolves với giá trị là response cho request đó.
//  * Khi promise resolves, response được truyền tới .then. Đây là nơi mà có thể sử dụng response. Nếu request không thành công, thì sẽ chuyển tới .catch với tham số là lỗi tương ứng.
//  */
// fetch(postAPI)
//     .then(response => response.json()) // response.json() sẽ Json.parse luôn: chuyển sang dữ liệu JS
//     .then(posts => {
//         // console.log(posts);
//         let html = posts.map(
//             post => `<li>
//                 <h2>${post.title}</h2>
//                 <p>${post.body}<p>
//             </li>`
//         );
//         document.querySelector('.comment-block').innerHTML = html.join('');
//     })
//     .catch(err => console.log('có lỗi'));

// let course = {
//     name: 'JS',
//     price: 1000,
//     image: 'image-address',
//     childObj: {
//         name: 'ReactJS',
//     },
// };

// let { name: parentName, price } = course;
// console.log(name, price);
// console.log(typeof name);

// function highlight([first, ...strings], ...values) {
//     return values
//         .reduce(
//             (acc, curVal) => [
//                 ...acc,
//                 `<span>${curVal}</span>`,
//                 `${strings.shift()}`,
//             ],
//             [first]
//         )
//         .join('');
//     // return values.reduce(
//     //     function (acc, curVal) {
//     //         acc.push(`<span>${curVal}</span>`);
//     //         acc.push(`${strings.shift()}`);
//     //         return acc;
//     //     },
//     //     [first]
//     // ).join('');
// }

// let course = 'JS';
// let brand = 'F8';
// console.log(highlight`Học lập trình ${course} tại ${brand}!`);

import logger from './logger/index.js';
// import { logger2 } from './logger/index.js';

// import { TYPE_LOG, TYPE_WARN, TYPE_ERROR } from './constants.js';
import * as constants from './constants.js';

logger('test message', constants.TYPE_LOG);
