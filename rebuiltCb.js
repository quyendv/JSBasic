// Chú ý nên dùng for-in kèm hasOwnProperty(index) để tránh duyệt cả empty hay prototype

/**
 * forEach2: sẽ bỏ qua các empty element và prototype tạo ra
 * @param {*} callback
 */
Array.prototype.forEach2 = function (callback) {
    for (let index in this) {
        if (this.hasOwnProperty(index)) {
            callback(this[index], index, this); // tương ứng val, index, array
        }
    }
};

/**
 * map2: thực hiện hành động của hàm callback và trả về mảng mới theo h.động đó
 * @param {*} callback
 * @returns a new array
 */
Array.prototype.map2 = function (callback) {
    let newArr = [];
    for (let i in this) {
        if (this.hasOwnProperty(i)) {
            newArr.push(callback(this[i], i, this));
        }
    }
    return newArr;
};

/**
 * filter2: lọc các phần tử t/m đk hàm callback truyền vào và return mảng mới chứa các phần tử đó
 * @param {*} callback
 * @returns new Arr
 */
Array.prototype.filter2 = function (callback) {
    let newArr = [];
    for (let i in this) {
        if (this.hasOwnProperty(i) && callback(this[i], i, this)) {
            // Chú ý phải t/m điều kiện hàm callback<vd như element chẵn, ...>
            // ở trên viết gộp đk, có thể tách ra cho dễ hiểu cũng được: https://youtu.be/eRM7ekb1iQU?t=346
            newArr.push(callback(this[i])); // chú ý nó chỉ trả về element của mảng nhớ
        }
    }
    return newArr;
};

/**
 * Ktra có ít nhất 1 phần tử t/m điều kiện hàm callback hay không
 * @param {*} callback
 * @returns true if at least one is true
 */
Array.prototype.some2 = function (callback) {
    for (let i in this) {
        if (this.hasOwnProperty(i) && callback(this[i], i, this)) {
            return true;
        }
    }
    return false;
};

/**
 * Ktra tất cả element có thỏa mãn điều kiện hàm callback không
 * @param {*} callback
 * @returns true if all is true
 */
Array.prototype.every2 = function (callback) {
    for (let i in this) {
        if (this.hasOwnProperty(i) && !callback(this[i], i, this)) {
            return false;
        }
    }
    return true;
};

// reduce function
Array.prototype.reduce2 = function (callback, result) {
    try {
        let arrayLength = this.length;
        if (arguments.length < 2) {
            result = this[0];
            for (let i = 1; i < arrayLength; ++i) {
                result = callback(result, this[i], i, this);
            }
        } else {
            for (let i = 0; i < arrayLength; ++i) {
                result = callback(result, this[i], i, this);
            }
        }
        return result;
    } catch (error) {
        console.error(error.message);
    }

    // try {
    //     let i = 0;
    //     if (arguments.length < 2) {
    //         i = 1;
    //         result = this[0];
    //     }

    //     for (; i < this.length; i++) {
    //         result = callback(result, this[i], i, this); // prevVal, curVal, index, array
    //     }
    //     return result;
    // } catch (error) {
    //     console.log(error.message);
    // }
};
