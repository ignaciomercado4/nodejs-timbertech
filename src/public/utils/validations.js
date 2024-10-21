const FORM_REQUIREMENTS = {
    password: {
        minLength: 8,
        patterns: {
            upperCase: /[A-Z]/,
            lowerCase: /[a-z]/,
            numbers: /[0-9]/,
            specialChars: /[#?!@$%^&*-]/
        }
    },
    name: {
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZÀ-ÿ\s]{2,50}$/
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxLength: 254
    }
};

function getFormElements() {
    return {
        form: document.querySelector('#registro-form'),
        name: document.querySelector('#name'),
        email: document.querySelector('#email'),
        password: document.querySelector('#password'),
        confirmPassword: document.querySelector('#confirm-password'),
        errorContainer: document.querySelector('#errors')
    };
}

function validateName(name) {
    const { pattern, minLength, maxLength } = FORM_REQUIREMENTS.name;

    if (!name || name.length < minLength) {
        return 'El nombre debe tener al menos 2 caracteres.';
    }

    if (name.length > maxLength) {
        return 'El nombre no puede exceder los 50 caracteres.';
    }

    if (!pattern.test(name)) {
        return 'El nombre solo puede contener letras y espacios.';
    }

    return '';
}

function validateEmail(email) {
    const { pattern, maxLength } = FORM_REQUIREMENTS.email;

    if (!email) {
        return 'El correo electrónico es requerido.';
    }

    if (email.length > maxLength) {
        return 'El correo electrónico es demasiado largo.';
    }

    if (!pattern.test(email)) {
        return 'Por favor, ingresa un correo electrónico válido.';
    }

    return '';
}

function validatePassword(password) {
    const { minLength, patterns } = FORM_REQUIREMENTS.password;

    if (password.length < minLength) {
        return false;
    }

    return Object.values(patterns).every(pattern => pattern.test(password));
}

function getPasswordErrorMessage(password, confirmPassword) {
    if (!password || !confirmPassword) {
        return 'Por favor, completa todos los campos de contraseña.';
    }

    if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden.';
    }

    if (!validatePassword(password)) {
        return `Tu contraseña debe tener al menos:
        - ${FORM_REQUIREMENTS.password.minLength} caracteres
        - Una letra mayúscula
        - Una letra minúscula
        - Un número
        - Un caracter especial (#?!@$%^&*-)`;
    }

    return '';
}

function validateRegistrationForm() {
    const elements = getFormElements();
    const errors = [];

    const nameError = validateName(elements.name.value.trim());
    if (nameError) errors.push(nameError);

    const emailError = validateEmail(elements.email.value.trim());
    if (emailError) errors.push(emailError);

    const passwordError = getPasswordErrorMessage(
        elements.password.value,
        elements.confirmPassword.value
    );
    if (passwordError) errors.push(passwordError);

    if (errors.length > 0) {
        elements.errorContainer.innerHTML = errors.map(error =>
            `<div class="error-message">${error}</div>`
        ).join('');
        return false;
    } else {
        elements.errorContainer.innerHTML = '';
        elements.form.submit();
        return true;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const elements = getFormElements();
    if (elements.form) {
        elements.form.addEventListener('submit', (e) => {
            e.preventDefault();
            validateRegistrationForm();
        });

        elements.name.addEventListener('blur', () => {
            const error = validateName(elements.name.value.trim());
            showFieldError(elements.name, error);
        });

        elements.email.addEventListener('blur', () => {
            const error = validateEmail(elements.email.value.trim());
            showFieldError(elements.email, error);
        });
    }
});

function showFieldError(field, error) {
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('field-error')) {
        errorElement.textContent = error;
    } else if (error) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('field-error');
        errorDiv.textContent = error;
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
}