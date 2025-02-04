$(document).ready(function () {
    const formSignin = $('.form-signin');
    const forgotPassword = $('#forgot-password');
    const enterCode = $('.enter-code');
    const passwordResetFinal = $('.password-reset-final');
    const forgotPassLink = $('.forgot-pass');
    const backToLoginLink = $('.back-to-login');
    const recoveryEmail = $('#recovery-email');
    const forgotPasswordError = $('#forgot-password-error');
    const sendCodeButton = $('#send-code');
    const confirmCodeButton = $('#confirm-code');
    const codeErrorPasswordConfirm = $('.small-error-password-confirm');
    const backToRecoveryEmail = $('.back-to-forgot-password');
    const codeError = $('#code-error');
    const backToEnterCode = $('#back-to-enter-code');
    const newPassword = $('#new-password');
    const confirmPassword = $('#confirm-password');
    const resetPasswordButton = $('#reset-password');
    const passwordResetForm = $('#password-reset-form');

    // Hide divs on page load
    const hideDivsOnLoad = () => {
        forgotPassword.addClass('hide-div');
        enterCode.addClass('hide-div');
        passwordResetFinal.addClass('hide-div');
        codeErrorPasswordConfirm.addClass('hide-div');
        codeError.addClass('hide-div');
    };

    // Reset all input fields on page load
    const resetInputFields = () => {
        $('input').val('');
    };

    // Toggle visibility of divs
    const toggleDivs = (hideDiv, showDiv) => {
        hideDiv.removeClass('show-div').addClass('hide-div');
        showDiv.removeClass('hide-div').addClass('show-div');
    };

    // Check if email is valid
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Check if all code inputs are filled
    const areAllInputsFilled = (inputs) => inputs.toArray().every(input => $(input).val().length === 1);

    // Check if passwords match
    const checkPasswordsMatch = () => {
        if (newPassword.val() === confirmPassword.val()) {
            codeErrorPasswordConfirm.addClass('hide-div');
            resetPasswordButton.prop('disabled', false);
        } else {
            codeErrorPasswordConfirm.removeClass('hide-div').addClass('show-div');
            resetPasswordButton.prop('disabled', true);
        }
    };

    // Initialize
    hideDivsOnLoad();
    resetInputFields();

    forgotPassLink.on('click', (e) => {
        e.preventDefault();
        toggleDivs(formSignin, forgotPassword);
    });

    backToLoginLink.on('click', (e) => {
        e.preventDefault();
        toggleDivs(forgotPassword, formSignin);
    });

    recoveryEmail.on('input', () => {
        if (isValidEmail(recoveryEmail.val())) {
            forgotPasswordError.removeClass('show-div');
            sendCodeButton.prop('disabled', false);
        } else {
            forgotPasswordError.addClass('show-div');
            sendCodeButton.prop('disabled', true);
        }
    });

    sendCodeButton.on('click', (e) => {
        e.preventDefault();
        toggleDivs(forgotPassword, enterCode);
    });

    backToRecoveryEmail.on('click', (e) => {
        e.preventDefault();
        toggleDivs(enterCode, forgotPassword);
    });

    $('.code-input').on('input', function (e) {
        const inputs = $('.code-input');
        const input = $(this);
        const index = inputs.index(input);
        const value = input.val();

        if (!/^\d$/.test(value)) {
            input.val('');
            codeError.text('The code is only numbers from 0 to 9. Try again.').addClass('show-div');
            confirmCodeButton.prop('disabled', true);
            return;
        } else {
            codeError.removeClass('show-div');
        }

        if (e.originalEvent.inputType === 'insertText' && e.originalEvent.data.length > 1) {
            const values = e.originalEvent.data.split('');
            inputs.each((i, el) => $(el).val(values[i] || ''));
        } else if (input.val().length === 1 && index < inputs.length - 1) {
            inputs.eq(index + 1).focus();
        }

        if (areAllInputsFilled(inputs)) {
            confirmCodeButton.prop('disabled', false).focus();
        } else {
            confirmCodeButton.prop('disabled', true);
        }
    });

    $('.code-input').on('paste', function (e) {
        const pasteData = e.originalEvent.clipboardData.getData('text');
        const inputs = $('.code-input');
        const values = pasteData.split('');

        if (!/^\d+$/.test(pasteData)) {
            const displayData = pasteData.length > 10 ? pasteData.substring(0, 10) + '...' : pasteData;
            codeError.text(`Paste only numbers. You are pasting: ${displayData}`).addClass('show-div');
            e.preventDefault();
            return;
        } else {
            codeError.removeClass('show-div');
        }

        inputs.each((i, el) => $(el).val(values[i] || ''));
        e.preventDefault();

        if (areAllInputsFilled(inputs)) {
            confirmCodeButton.prop('disabled', false).focus();
        } else {
            confirmCodeButton.prop('disabled', true);
        }
    });

    confirmCodeButton.on('click', (e) => {
        e.preventDefault();
        toggleDivs(enterCode, passwordResetFinal);
    });

    backToEnterCode.on('click', (e) => {
        e.preventDefault();
        toggleDivs(passwordResetFinal, enterCode);
    });

    newPassword.on('input', checkPasswordsMatch);
    confirmPassword.on('input', checkPasswordsMatch);

    passwordResetForm.on('submit', (e) => {
        e.preventDefault();
        $('#password-reset-modal').modal('show');
        let countdown = 5;
        const interval = setInterval(() => {
            $('#countdown').text(countdown);
            countdown--;
            if (countdown < 0) {
                clearInterval(interval);
                location.reload();
            }
        }, 1000);
    });
});