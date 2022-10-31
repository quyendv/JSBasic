// Có thể tham khảo folder FormValidationI-WebHomeWork tự làm lại + chưa xử lý radio, checkbox sẽ dễ hiểu hơn, 1 số rule tự thêm
// options = { form, formGroup, formMsg, rule: [...], onsubmit }
function Validator(options) {
    // Lưu các rule dưới dạng 1 object {key: value} với key là các selector<các input muốn check> và value là 1 array lưu các hàm cần test (isRequired, isConfirmed, ...)
    let selectorRules = {}; // Có thể hiểu là inputSelectorTestFunctions là đúng nhất

    let formElement = document.querySelector(options.form);

    if (formElement) {
        options.rules.forEach((rule) => {
            // Xử lý submit form: có thể tạo hàm khác cho gọn cũng được (clean code sau)
            formElement.onsubmit = (e) => {
                e.preventDefault(); // Tạm chặn việc nếu form trống submit sẽ lỗi page

                let isFormValid = true;
                // Lặp qua từng rule và validate xem có lỗi nào không
                options.rules.forEach((rule) => {
                    let inputElement = document.querySelector(rule.selector); // này không cần $$ rồi forEach vì đây chỉ check các rule và validate thôi (đã có validate riêng cho raido rồi)
                    let currentRuleIsValid = validate(inputElement, rule);
                    if (!currentRuleIsValid) {
                        isFormValid = false; // không break, để nó xử lý formMsg hết luôn, chứ k phải chỉ check hợp lệ k
                    }
                });

                // Xử lý submit sau khi biết có / không có lỗi nào
                if (isFormValid) {
                    // submit với js
                    if (typeof options.onsubmit === 'function') {
                        let enableInputs = formElement.querySelectorAll('[name]:not([disabled])'); // các input(tính cả select) mà k bị disabled (cấm điền)
                        let formValues = Array.from(enableInputs).reduce(function (values, input) {
                            // Bổ sung hàm xử lý TH radio/checkbox nên 2 cách sau chưa biết cách xử lý
                            switch (input.type) {
                                case 'checkbox':
                                    if (!input.checked) {
                                        // hoặc !input.matches(':checked')
                                        return values; // return ở đây là kết thúc lần lặp hiện tại, nó giống như break nhưng k ktra đk dưới nữa thôi
                                    }
                                    if (!Array.isArray(values[input.name])) {
                                        values[input.name] = [];
                                    }
                                    values[input.name].push(input.value);
                                    break;
                                case 'radio':
                                    if (input.matches(':checked')) values[input.name] = input.value; // hoặc input.checked cũng được
                                    // values[input.name] = formElement.querySelector(
                                    //     `input[name="${input.name}"]:checked`
                                    // ); // có thể dùng đc cách này cho cách 3 (spread) mỗi tội ?: hơi dài
                                    break;
                                case 'file':
                                    values[input.name] = input.files;
                                    break;
                                default:
                                    values[input.name] = input.value;
                            }
                            return values;

                            // hoặc gọn hơn kết hợp toán tủ logic:
                            // return (values[input.name] = input.value) && values;
                            // Chú ý luôn auto return values nhé vì ở đây check input.value khác undefined rồi nên xét đến cuối là values;
                            // À sai, hạn chế dùng cách này, gọn nhưng nếu 1 field không có yêu cầu gì (có thể điền rỗng) -> falsy nên k return values đc

                            // return { ...values, [input.name]: input.value }; // nếu return thì như vậy, còn arrow function thì phải ngoặc nhọn cụm {...}
                        }, {});
                        // console.log(formValues);
                        options.onsubmit(formValues);
                    } else {
                        // submit với hành vi mặc định của html
                        formElement.submit();
                    }
                }
            };

            // Lưu lại các rule cho mỗi inputElement
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            // Lấy input element và xử lý: Chú ý sửa lại $$ vì inputElement có thể nhiều (radio cùng name - Gender)
            let inputElements = document.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach((inputElement) => {
                if (inputElement) {
                    // Xử lý blur khỏi input
                    inputElement.onblur = () => {
                        validate(inputElement, rule);
                    };

                    // Xử lý khi nhập vào input (focus and typing): cứ gõ 1 kí tự cũng fire nhé -> khi gõ thì phải mất invalid đi (focus vào vẫn đỏ nhé, đúng ra onfocus hợp hơn)
                    inputElement.oninput = () => {
                        // let formMsg = inputElement.parentElement.querySelector(options.formMsg); // thẻ span nơi show thông báo lỗi
                        let formGroup = getParent(inputElement, options.formGroup); // tránh gọi nhiều lần vì nó while mà, cơ mà cũng k tốn lặp quá đâu
                        let formMsg = formGroup.querySelector(options.formMsg);
                        formMsg.innerHTML = '';
                        formGroup.classList.remove('invalid');
                    };
                }
            });
        });
    }

    // Cũng k đúng là validate: nó chỉ xem là nếu hàm test input.value trả về thông báo lỗi thì blur hiện mes lỗi (focus lại vẫn đỏ nhé) còn không thì k báo gì
    // inputElement: NodeElement, rule là object chứa inputSelector và hàm test (hàm trả về err msg or undefined) của input đó: VD: input email check isRequired, isEmail
    function validate(inputElement, rule) {
        // let formMsg = inputElement.parentElement.querySelector(options.formMsg); // thẻ span nơi show thông báo lỗi
        let formGroup = getParent(inputElement, options.formGroup); // Tách ra vì dùng nhiều chỗ bên dưới thay vì gộp với dòng dưới
        let formMsg = formGroup.querySelector(options.formMsg);

        // let errorMsg = rule.test(inputElement.value); // nội dung lỗi hoặc undefined
        let errorMsg;

        // lấy các rules (các hàm test) của input hiện tại
        let rules = selectorRules[rule.selector]; // DS các hàm ktra của inputElement hiện tại

        // Ktra từng rule (test) nếu có lỗi trả về thì break và xử lý in lỗi đó ra -> kiểu nếu lỗi 1 là isRequired thì sẽ xử lý nếu k nhập, nhập vào thì hết lỗi isRequired và đến lỗi 2 là isEmail, kiểu thế -> Tuy nhiên phải biết điều kiện nào cần gọi trước (isRequired gọi trước isEmail) nếu không sẽ lỗi logic, k như mong muốn
        for (let i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'checkbox':
                case 'radio':
                    errorMsg = rules[i](formElement.querySelector(`${rule.selector}:checked`)); // ta muốn lấy ra input radio checked, nếu không có (null-falsy) thì hàm test(ở đây là của isRequired) sẽ trả về errorMsg, nếu tìm thấy (truthy) sẽ return undefined
                    break;
                default: // chạy các hàm test và truyền value của input vào
                    errorMsg = rules[i](inputElement.value); // luôn lưu kết quả hàm test đầu, nên thứ tự rule truyền vào là quan trọng
            }
            if (errorMsg) break;
        }

        if (errorMsg) {
            formMsg.innerHTML = errorMsg;
            formGroup.classList.add('invalid'); // thêm invali vào form-group để nó hiện màu đỏ input và formMsg
        } else {
            formMsg.innerHTML = '';
            formGroup.classList.remove('invalid');
        }

        return !errorMsg; // Nếu có errorMsg (tức có lỗi - ở dạng truthy vì nó khác undefined) thì return !errorMsg (gọn từ !(!!errorMsg))
    }

    // Lấy thẻ cha form-group của thẻ inputElement để rồi truy ra form-message
    function getParent(element, selector) {
        // while (element.parentNode) {
        //     if (element.parentNode.matches(selector)) {
        //         return element.parentNode;
        //     }
        //     element = element.parentNode;
        // }
        return element.closest(selector); // như trên, k thấy return null
    }
}

/* *********************** Các hàm check, là object chứa inputSelector và err msg nếu lỗi, trả về 1 object chứa inputSelector và chứa hàm test (return undefined or err msg truyền vào)  */

/**
 * Khi có lỗi trả về msg lỗi, còn khi hợp lệ (chú ý trim()) thì không trả về gì (undefined).
 * @param {*} selector
 * @param {*} message
 * @returns
 */
Validator.isRequired = function (selector, message) {
    return {
        selector, // selector of input field
        test: function (value) {
            // vì check radio ta trả về hẳn 1 object(nếu thấy) or null nên k dùng trim() như value của input khác đc, xử lý nếu là string thì trim() để check, nếu là object và khác null (vì null cũng tính là object) thì mới k lỗi, else return msg lỗi
            return (typeof value === 'string' && value.trim()) || (typeof value === 'object' && value !== null)
                ? undefined
                : message || 'Vui lòng nhập trường này';
        },
    };
};

/**
 * Ktra email hợp lệ: validate email js: https://www.w3resource.com/javascript/form/email-validation.php
 * @param {*} selector
 * @param {*} message
 * @returns
 */
Validator.isEmail = function (selector, message) {
    return {
        selector,
        test: function (value) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email'; // hàm test của regex khác đấy nhá
        },
    };
};

Validator.minLength = function (selector, min, message) {
    return {
        selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        },
    };
};

/**
 * Xác thực lại password
 * @param {*} selector
 * @param {*} getConfirmValue
 * @param {*} message
 * @returns
 */
Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        },
    };
};
