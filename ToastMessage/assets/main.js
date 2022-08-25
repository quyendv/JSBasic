const icons = {
    success: 'fa fa-solid fa-circle-check',
    info: 'fa fa-solid fa-circle-info',
    warning: 'fa fa-solid fa-circle-exclamation',
    error: 'fa fa-solid fa-radiation',
};

function toast({
    title = '',
    message = '',
    type = 'success',
    duration = 3000,
}) {
    const main = document.querySelector('#toast');
    if (main) {
        const toastItem = document.createElement('div');
        toastItem.classList.add('toast', `toast--${type}`);

        const autoRemove = setTimeout(() => {
            main.removeChild(toastItem);
        }, duration + 1000); // thời gian delay + 1s biến mất dần

        toastItem.onclick = e => {
            if (e.target.closest('.toast__close')) {
                main.removeChild(toastItem);
                clearTimeout(autoRemove);
            }
        };

        toastItem.innerHTML = `
                <div class="toast__icon">
                    <i class="${icons[type]}"></i>
                </div>

                <div class="toast__body">
                    <div class="toast__title">${title}</div>
                    <div class="toast__msg">${message}</div>
                </div>

                <div class="toast__close">
                    <i class="fa fa-solid fa-xmark"></i>
                </div>`;

        toastItem.style.animation = `slideToLeft 0.3s ease-out, fadeOut 1s linear ${(
            duration / 1000
        ).toFixed(2)}s forwards`;
        main.appendChild(toastItem);

        toastItem.style.transition = 'all 0.3s linear';
    }
}

// toast({
//     title: 'Success',
//     message: 'Máy vi tính kết nối internet (Windows, Ubutu hoặc MacOS)',
//     type: 'success',
//     duration: 3000,
// });

function showSuccessToast() {
    toast({
        title: 'Thành công!',
        message: 'Bạn đã đăng ký thành công tài khoản tại F8!',
        type: 'success',
        duration: 3000,
    });
}

function showErrorToast() {
    toast({
        title: 'Thất bại!',
        message: 'Có lỗi xảy ra, vui lòng liên hệ quản trị viên!',
        type: 'error',
        duration: 3000,
    });
}
