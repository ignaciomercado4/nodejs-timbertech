const FORM_REQUIREMENTS = {
    name: /^[a-zA-Z\s]{4,50}$/,
    email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
};

function getFormElements() {
    const $form = document.querySelector('#registro-form');
    const formData = new FormData($form);
    return Object.fromEntries(formData);
}

function showErrors(errorsArray) {
    errorsArray.forEach((field) => {
        const inputElement = document.getElementById(field);
        inputElement.classList.add('is-invalid');
    });
}

function clearErrors() {
    document.querySelectorAll('.is-invalid').forEach((element) => {
        element.classList.remove('is-invalid');
    });
}

function validatePasswordsMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    return password === confirmPassword;
}

function validateRegistrationForm() {
    clearErrors();
    const formEntries = getFormElements();
    delete formEntries["confirm-password"];

    let errorsArray = [];

    for (const entry in formEntries) {
        if (FORM_REQUIREMENTS[entry] && !FORM_REQUIREMENTS[entry].test(formEntries[entry])) {
            errorsArray.push(entry);
        }
    }

    if (!validatePasswordsMatch()) {
        errorsArray.push("confirm-password");
    }

    if (errorsArray.length === 0) {
        document.querySelector('#registro-form').submit();
    } else {
        showErrors(errorsArray);
    }
}

document.querySelector('#submit-button').onclick = validateRegistrationForm;
