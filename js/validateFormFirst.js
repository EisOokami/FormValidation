const validateFormFirst = (e, input, validationContainer, inputType, errorType, form, modalContainer, passwordValue = "") => {
    const showModalMessage = (message, container, modal) => {
        modal.classList.add("modal");
        modal.classList.remove("hidden");

        const iconPosition = container.getBoundingClientRect();
        modal.style.left = `${iconPosition.right}px`;
        modal.style.top = `${window.scrollY + iconPosition.top - 10}px`;

        modal.textContent = message;
        document.body.append(modal);
    };

    const hideModalMessage = (modal) => {
        modal.classList.add("hidden");
    };

    const showInlineMessage = (message, container) => {
        checkValidate = false;
        container.classList.remove("hidden");
        container.classList.add("err-inline");

        container.textContent = message;
        container.style.width = `${form.offsetWidth}px`;

        input.style.border =  "2px #ff0000 solid";
        input.style.borderBottom =  "4px #ff0000 solid";
    };

    const showAbsoluteMessage = (message, container, modal = modalContainer) => {
        checkValidate = false;
        container.classList.remove("hidden");
        container.classList.add("err-absolute");

        container.addEventListener("mouseover", () => {
            showModalMessage(message, container, modal);
        });
        container.addEventListener("mouseout", () => {
            hideModalMessage(modal);
        });

        input.style.border =  "2px #ff0000 solid";
        input.style.borderBottom =  "4px #ff0000 solid";
    };

    const validateUsername = (value, container, func) => {
        const stringRegex = /^[A-Za-z][A-Za-z0-9_]{4,29}$/;

        if (!stringRegex.test(value)) {
            func("Invalid username", container);
        }
    }

    const validateEmail = (value, container, func) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!emailRegex.test(value)) {
            func("Invalid email address", container);
        }
    };
    
    const validatePassword = (value, container, func) => {
        if (value.trim() === "") {
            func("Empty input", container);
            return;
        }
    
        if (value.length < 8) {
            func("Password should be at least 8 characters long", container);
            return;
        }

        if (value.length > 255) {
            func("Password should be at most 255 characters long", container);
            return;
        }
    
        if (/\s/.test(value)) {
            func("Spaces are not allowed", container);
            return;
        }
    
        const params = [
            {reg: /[0-9]/g, message: "Should contain at least one digit"},
            {reg: /[a-z]/g, message: "Should contain at least one lowercase letter"},
            {reg: /[A-Z]/g, message: "Should contain at least one uppercase letter"},
            {reg: /[^A-Za-z0-9\s]/g, message: "Should contain at least one special character"},
        ];
    
        params.forEach(obj => {
            const {reg, message} = obj;
    
            if (!reg.test(value)) {
                func(message, container);
            }
        });
    };
    
    const validateConfirmPassword = (value, passwordValue, container, func) => {
        if (value !== passwordValue || passwordValue.length < 8) {
            func("Passwords do not match", container);
        }
    };

    // ==============================================

    const showErrorMessage = errorType === "absolute" ? showAbsoluteMessage : showInlineMessage;
    let checkValidate = true;

    if (!validationContainer.parentNode) {
        validationContainer.classList.add("hidden");
        input.insertAdjacentElement("afterend", validationContainer);
    }

    validationContainer.textContent = "";
    validationContainer.classList.add("hidden");

    input.style.border = "2px green solid";

    switch(inputType) {
        case "username":
            validateUsername(input.value, validationContainer, showErrorMessage);
            break;
        case "email":
            validateEmail(input.value, validationContainer, showErrorMessage);
            break;
        case "password":
            validatePassword(input.value, validationContainer, showErrorMessage);
            break;
        case "confirm-password":
            validateConfirmPassword(input.value, passwordValue, validationContainer, showErrorMessage);
            break;
        default:
            showInlineMessage("Unknown input type", validationContainer);
            break;
    }

    if (!checkValidate) {
        e.preventDefault();
    }
}

const form = document.querySelector("form");
const usernameInput = document.querySelector("#username");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirm-password");

const usernameValidationContainer = document.createElement("div");
const emailValidationContainer = document.createElement("div");
const passwordValidationContainer = document.createElement("div");
const confirmPasswordValidationContainer = document.createElement("div");

const usernameModalContainer = document.createElement("div");
const emailModalContainer = document.createElement("div");
const passwordModalContainer = document.createElement("div");
const confirmPasswordModalContainer = document.createElement("div");

form.addEventListener("submit", (e) => {
    validateFormFirst(e, usernameInput, usernameValidationContainer, "username", "inline", form, usernameModalContainer);
    validateFormFirst(e, emailInput, emailValidationContainer, "email", "inline", form, emailModalContainer);
    validateFormFirst(e, passwordInput, passwordValidationContainer, "password", "absolute", form, passwordModalContainer);
    validateFormFirst(e, confirmPasswordInput, confirmPasswordValidationContainer, "confirm-password", "absolute", form, confirmPasswordModalContainer, passwordInput.value);
});