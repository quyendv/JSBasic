const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Validator(options) {
    let inputSelectorTestFuncs = {}; // selectorRules
    const formElement = $(options.form);
    if (formElement) {
        options.rules.forEach((rule) => {
            if (Array.isArray(inputSelectorTestFuncs[rule.selector])) {
                inputSelectorTestFuncs[rule.selector].push(rule.test);
            } else {
                inputSelectorTestFuncs[rule.selector] = [rule.test];
            }

            // const inputElements = $$(rule.selector); // k xét radio, checkbox nên k cần
            const inputElement = $(rule.selector);
            if (inputElement) {
                inputElement.onblur = () => {
                    validate(inputElement, rule);
                };
            }

            handleSubmit(formElement);
        });
    }

    function validate(inputElement, rule) {
        const formGroup = inputElement.closest(options.formGroup);
        const formMessage = formGroup.querySelector(options.formMessage);
        let errMsg;

        let testFuncs = inputSelectorTestFuncs[rule.selector];
        // testFuncs.forEach((test) => {
        //     // k xét type đặc biệt nên k cần switch
        //     errMsg = test(inputElement.value); // luôn lấy msg đầu
        //     if (errMsg) break;
        // });
        for (const test of testFuncs) {
            // k xét type đặc biệt nên k cần switch
            errMsg = test(inputElement.value); // luôn lấy msg đầu
            if (errMsg) break;
        }

        if (errMsg) {
            formMessage.innerHTML = errMsg;
            formGroup.classList.add('invalid');
        } else {
            formMessage.innerHTML = '';
            formGroup.classList.remove('invalid');
        }

        return !errMsg; // nhớ thêm đoạn này
    }

    function handleSubmit(formElement) {
        formElement.onsubmit = (e) => {
            e.preventDefault();

            let isValidForm = true;
            options.rules.forEach((rule) => {
                let inputElement = $(rule.selector);
                if (!validate(inputElement, rule)) {
                    console.log(rule);
                    isValidForm = false;
                }
            });

            console.log(isValidForm);

            if (isValidForm) {
                const sexValue = $('[name="sex"]:checked')?.value;
                const fullname = $('#name').value;
                $('.notices').innerHTML = `Chúc mừng ${sexValue || ''} ${fullname} đã đăng ký thành công`;
            } else {
                $('.notices').innerHTML = `Invalid Data Form`;
            }
        };
    }
}

Validator.isRequired = function (selector, message) {
    return {
        selector,
        test: function (value) {
            return typeof value === 'string' && value.trim() ? undefined : message || 'This field is required';
        },
    };
};

Validator.isMinMaxLength = function (selector, min, max, message) {
    return {
        selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `This field must have ${min}-${max} characters`;
        },
    };
};

Validator.isEmail = function (selector, message) {
    return {
        selector,
        test: function (value) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'This field must be email';
        },
    };
};
Validator.isNumber = function (selector, message) {
    return {
        selector,
        test: function (value) {
            return typeof value === 'string' && !isNaN(value) && !isNaN(parseFloat(value))
                ? undefined
                : 'This field is not a number';
        },
    };
};

Validator.isMinValue = function (selector, min, message) {
    return {
        selector,
        test: function (value) {
            return Validator.isNumber(value) && Number(value) >= min
                ? undefined
                : `This filed is greater than or equal to ${min}`;
        },
    };
};
Validator.isRePassword = function (selector, otherSelector, message) {
    return {
        selector,
        test: function (value) {
            const confirmValue = $(otherSelector).value;
            return value === confirmValue ? undefined : 'This field is incorrect password';
        },
    };
};
