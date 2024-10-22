const FORM_REQUIREMENTS = {
    name: /^[a-zA-Z\s]{4,50}$/,
    email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
};

function getFormElements() {
    const $form = document.querySelector('#registro-form');
    const formData = new FormData($form);

    return Object.fromEntries(formData);
}

function validateRegistrationForm() {
    const formEntries = getFormElements();

    for (const entry in formEntries) {
        if (FORM_REQUIREMENTS[entry] && FORM_REQUIREMENTS[entry].test(formEntries[entry])) {
            console.log(entry, " pasa");
        } else {
            console.log(entry, " no pasa");
        }
    }
}

document.querySelector('#submit-button').onclick = validateRegistrationForm;