function Validator(formSelector) {
    // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-this-alias
    let _this = this;
    let formRules = {}; // obj chứa key là các inputName và value là dãy các hàm test

    // Các hàm test
    let validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function (value) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Trường này phải là email';
        },
        min: function (min) {
            return function (value) {
                return value.trim().length >= min
                    ? undefined
                    : `Vui lòng nhập tối thiểu ${min} ký tự`;
            };
        },
        max: function (max) {
            return function (value) {
                return value.trim().length <= max ? undefined : `Vui lòng nhập tối đa ${max} ký tự`;
            };
        },
    };

    // Lấy formElement trong DOM
    let formElement = document.querySelector(formSelector);

    if (formElement) {
        let inputs = formElement.querySelectorAll('[name][rules]'); // các input có rules

        for (let input of inputs) {
            // Lấy các rules (các hàm test) truyền vào formRules
            let rules = input.getAttribute('rules').split('|'); // mảng các rules của curInputElement
            for (let rule of rules) {
                if (!Array.isArray(formRules[input.name])) formRules[input.name] = [];

                // min: length, max: length
                if (rule.includes(':')) {
                    const [ruleInfo, length] = rule.split(':'); // destructuring: ruleInfo là tên key (min/max), length là min/maxLength, tránh đặt cùng tên ruleInfo thành rule như trên for, gây lỗi (mặc dù khai báo lại biến bên trong hiểu là biến khác mà nhỉ ? :D)
                    formRules[input.name].push(validatorRules[ruleInfo](length)); // validatorRules[rule] là hàm min/max (nhận giá trị là minLength/maxLength) và return 1 function khác nhận inputValue
                } else {
                    formRules[input.name].push(validatorRules[rule]); // còn validatorRules[rule] ở đây là các hàm nhận đối số là inputValue
                }
            }

            // Lắng nghe sự kiện để validate: (blur, input/focus hợp hơn)
            input.onblur = handleValidate; // giống hàm validate của phần trước
            input.oninput = handleClearError; // phần trước k tạo hàm riêng
        }

        // Xử lý hành vì submit form: nên để trong if(formElement) vì phải có form mới xử lý chứ
        // Chú ý ở trong hàm onsubmit này mà dùng this nó là đối tượng formElement chứ k phải instance được tạo ở trong file html nhé, nên phải dùng _this
        formElement.onsubmit = function (event) {
            event.preventDefault();

            // Ktra xem formValid không
            let isFormValid = true;
            for (let input of inputs) {
                let curRuleIsValid = handleValidate({ target: input }); // Tự gán để event.target là input :D, hay vl; chủ động check input truyền vào chứ k đợi blur
                if (!curRuleIsValid) {
                    isFormValid = false;
                    // break; // không được break, vì dù 1 cái sai ta vẫn phải check hết còn lại để còn báo đỏ nữa
                }
                // Chú ý đoạn trên có thể cho thằng hàm vào if check cho gọn hơn
            }

            // Nếu form đã valid rồi: lấy các value ra để lấy data: copy bên kia, chú ý onSumit và onsubmit
            if (isFormValid) {
                if (typeof _this.onSubmit === 'function') {
                    let enableInputs = formElement.querySelectorAll('[name]:not([disabled])'); // các input(tính cả select) mà k bị disable (cấm điền)
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
                    _this.onSubmit(formValues);
                } else {
                    // formElement.submit();
                    console.log('error');
                }
            }
        };
    }

    /**
     * Hàm này thực chất k phải chỉ xử lý khi onblur đâu, nó là hàm ktra value của input (event.target) truyền vào có hợp lệ với các rules áp đặt với input đó không (từ formRules[input.name])
     * -> Phần trước không hiểu rõ nên giờ phải note lại:
     *  + Khi 1 input fires sự kiện onblur nó sẽ truyền vào hàm này input đó và ktra xem input đó có hợp lệ k -> chỉ blur mới check
     *  + Khi thực hiện submit (onsubmit) thì phải ktra hết input hợp lệ không, nên ta phải duyệt các input (thực ra là input có rules) và chủ động truyền input đó vào để check (chứ k còn lắng nghe blur mới check nữa)
     */
    function handleValidate(event) {
        let rules = formRules[event.target.name]; // lấy danh sách các hàm test của input bị blur (event.target là input đó)

        // Duyệt qua các rule trong danh sách: rule nào mà có errorMsg thì break (như cách cũ dùng lặp ấy, ở đây dùng find custom)
        let errorMsg;
        // rules.find(rule => {
        //     errorMsg = rule(event.target.value); // thay vì return rule(event.target.value) ta gán rồi return errorMsg để nó k trả về rule mà là error
        //     return errorMsg;
        // });
        for (let rule of rules) {
            errorMsg = rule(event.target.value);
            if (errorMsg) break;
        }

        // Lúc này errorMsg là thông báo lỗi hoặc undefined, nếu có lỗi ta xử lý
        if (errorMsg) {
            let formGroup = event.target.closest('.form-group'); // có thể thay closest bằng hàm getParent (ktra matches()) như trước cũng được. Chú ý ở đây ta mặc định là .form-group, sau này có thể truyền selector vào, hoặc cũng có thể thêm class .form-group cho dự án khác là đc
            if (formGroup) {
                formGroup.classList.add('invalid');
                let formMsg = formGroup.querySelector('.form-message'); // nơi show thông báo lỗi
                if (formMsg) formMsg.innerText = errorMsg;
            }
        }
        return !errorMsg; // giống phần trước
    }

    function handleClearError(event) {
        let formGroup = event.target.closest('.form-group');
        if (formGroup && formGroup.classList.contains('invalid')) {
            formGroup.classList.remove('invalid');
            let formMsg = formGroup.querySelector('.form-message');
            if (formMsg) formMsg.innerText = '';
        }
    }
}
