const FORM_REQUIREMENTS = {
    name: /^[a-zA-Z\s]{4,50}$/,
    email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
};

const FORM_REQUIREMENTS_EXPLAINED = {
    name: "El nombre debe tener entre 4 y 50 caracteres, usar solo letras y espacios",
    email: "El email es inválido.",
    password: "La contraseña debe tener al menos 8 caracteres, al menos una letra mayúscula y una minúscula, al menos un número y un caracter especial (#?!@$ %^&*-)."
}

function getFormElements() {
    const $form = document.querySelector('#registro-form');
    const formData = new FormData($form);

    return Object.fromEntries(formData);

}

function showErrors(errorsArray) {
    console.log(errorsArray)
}

function validateRegistrationForm() {
    const formEntries = getFormElements();
    delete formEntries["confirm-password"];

    let errorsArray = [];

    for (const entry in formEntries) {
        if (FORM_REQUIREMENTS[entry] && FORM_REQUIREMENTS[entry].test(formEntries[entry])) {
            console.log(entry, ' pasa')
        } else {
            errorsArray.push(FORM_REQUIREMENTS_EXPLAINED[entry]);
        }
    }

    showErrors(errorsArray)
}



document.querySelector('#submit-button').onclick = validateRegistrationForm;