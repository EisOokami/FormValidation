const validateForm = (e, input, validationContainer, inputType, errorType, form, modal, passwordValue = "") => {
    e.preventDefault();

    const showModalMessage = (message, container) => {
        modal.classList.add("modal");
        modal.classList.remove("hidden");

        console.log(modal);

        const iconPosition = container.getBoundingClientRect();

        modal.style.left = `${iconPosition.right}px`;
        modal.style.top = `${window.scrollY + iconPosition.top - 10}px`;

        modal.textContent = message;
        document.body.append(modal);
    };

    const hideModalMessage = () => {
        modal.classList.add("hidden");
    };

    const showInlineMessage = (message, container) => {
        container.classList.remove("hidden");
        container.classList.add("err-inline");

        container.textContent = message;
        container.style.width = `${form.offsetWidth}px`;

        input.style.border =  "2px #ff0000 solid";
        input.style.borderBottom =  "4px #ff0000 solid";
    };

    const showAbsoluteMessage = (message, container) => {
        container.classList.remove("hidden");
        container.classList.add("err-absolute");

        container.addEventListener("mouseover", () => {
            showModalMessage(message, container);
        });
        container.addEventListener("mouseout", () => {
            hideModalMessage();
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

        if (value.length > 254) {
            func("Password should be at most 254 characters long", container);
            return;
        }
    
        if (/\s/.test(value)) {
            func("Spaces are not allowed", container);
            return;
        }
    
        const params = [
            {reg: /[0-9]/g, element: "Should contain at least one digit"},
            {reg: /[a-z]/g, element: "Should contain at least one lowercase letter"},
            {reg: /[A-Z]/g, element: "Should contain at least one uppercase letter"},
            {reg: /[^A-Za-z0-9\s]/g, element: "Should contain at least one special character"},
        ];
    
        params.forEach(obj => {
            const {reg, element} = obj;
    
            if (!reg.test(value)) {
                func(element, container);
            }
        });
    };
    
    const validateConfirmPassword = (value, passwordValue, container, func) => {
        if (value !== passwordValue) {
            func("Passwords do not match", container);
        }
    };

    if (!validationContainer.parentNode) {
        validationContainer.classList.add("hidden");
        input.insertAdjacentElement("afterend", validationContainer);
    }

    validationContainer.textContent = "";
    validationContainer.classList.add("hidden");

    input.style.border = "2px green solid";

    let funcName = null;

    switch(errorType) {
        case "inline":
            funcName = showInlineMessage;
            break;
        case "absolute":
            funcName = showAbsoluteMessage;
            break;
        default:
            funcName = showInlineMessage;
            break;
    }

    switch(inputType) {
        case "username":
            validateUsername(input.value, validationContainer, funcName);
            break;
        case "email":
            validateEmail(input.value, validationContainer, funcName);
            break;
        case "password":
            validatePassword(input.value, validationContainer, funcName);
            break;
        case "confirm-password":
            validateConfirmPassword(input.value, passwordValue, validationContainer, funcName);
            break;
        default:
            showInlineMessage("Unknown input type", validationContainer);
            break;
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
    validateForm(e, usernameInput, usernameValidationContainer, "username", "absolute", form, usernameModalContainer);
    validateForm(e, emailInput, emailValidationContainer, "email", "absolute", form, emailModalContainer);
    validateForm(e, passwordInput, passwordValidationContainer, "password", "absolute", form, passwordModalContainer);
    validateForm(e, confirmPasswordInput, confirmPasswordValidationContainer, "confirm-password", "absolute", form, confirmPasswordModalContainer, passwordInput.value);
});