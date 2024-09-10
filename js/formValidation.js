const formValidation = (e) => {
    const serializeForm = (formNode) => {
        return new FormData(formNode);
    };

    const addErrorContainerForFormElements = (inputElement) => {
        if (inputElement.type === "password" || inputElement.type === "text" || inputElement.type === "email" || inputElement.type === "tel") {
            let checkErrorElement = true;

            for (let i = 0; i < inputElement.parentElement.children.length; i++) {
                if (inputElement.parentElement.children[i].classList.contains("err-all")) {
                    checkErrorElement = false;
                }
            }

            if (checkErrorElement) {
                inputElement.insertAdjacentHTML("afterend", `<div class='hidden err-all err-${inputElement.name}'></div>`);
            }
        }
    };

    const addModalContainerForFormElements = (inputElement) => {
        const modalElement = document.createElement("div");
        modalElement.classList.add("hidden", "modal-all", `modal-${inputElement.name}`);
        modalElement.id = `modal-${inputElement.name}`;

        if ((inputElement.type === "password" || inputElement.type === "text" || inputElement.type === "email" || inputElement.type === "tel") && !document.getElementById(`modal-${inputElement.name}`)) {
            inputElement.insertAdjacentHTML("afterend", `<div class="hidden err-absolute err-absolute-${inputElement.name}"></div>`);
            inputElement.insertAdjacentElement("afterend", modalElement);
        }
    };

    const addStrengthIndicatorForPassword = (inputElement) => {
        if (inputElement.type === "password" && !inputElement.nextElementSibling.classList.contains("progress-all") && !(inputElement.name === "confirm-password")) {
            inputElement.insertAdjacentHTML("afterend", `<progress value="0" max="100" class='progress-all progress-${inputElement.name}'></progress>`);
        }
    };

    const addBtnPasswordVisibility = (inputElement) => {
        const btnElement = document.createElement("div");

        btnElement.classList.add("visibility-all", "btn-visibility", `btn-${inputElement.name}`);
        
        if (inputElement.type === "password" && !(inputElement.previousElementSibling && inputElement.previousElementSibling.classList.contains("visibility-all"))) {
            inputElement.insertAdjacentElement("beforebegin", btnElement);

            btnElement.addEventListener("click", (e) => {
                togglePasswordVisibility(e, inputElement);
            });
        }
    };
    
    const togglePasswordVisibility = (e, input) => {
        if (input.type === "password") {
            e.target.classList.add("visibility-all-off");
            e.target.classList.remove("visibility-all");
            input.setAttribute("type", "text");
        } else {
            e.target.classList.add("visibility-all");
            e.target.classList.remove("visibility-all-off");
            input.setAttribute("type", "password");
        }
    }

    const showModalMessage = (message, modalContainer) => {
        modalContainer.classList.remove("hidden");

        modalContainer.style.top = `${window.scrollY - modalContainer.offsetHeight - 10}px`;

        modalContainer.textContent = message;
    };

    const hideModalMessage = (modalContainer) => {
        modalContainer.classList.add("hidden");
    };

    const showAbsoluteMessage = (input, container, modalContainer) => {
        let message = "";
        
        container.classList.remove("hidden");
        container.classList.add("err-absolute");

        switch(input.type) {
            case "password":
                message = "Requires at least one uppercase letter, one lowercase letter, one digit, and one special character. Minimum 20 characters required"
                break;
            case "text":
                message = "4-29 characters required. Must contain at least one letter"
                break;
            case "email":
                message = "Ensure a valid email format (e.g., example@example.com)"
                break;
            case "tel":
                message = "Enter a valid phone number in international format (e.g., +1234567890)";
                break;
        }

        hideModalMessage(modalContainer);

        container.addEventListener("mouseover", () => {
            showModalMessage(message, modalContainer);
        });
        container.addEventListener("mouseout", () => {
            hideModalMessage(modalContainer);
        });

        input.addEventListener("input", () => {
            if (input.checkValidity()) {
                container.classList.add("hidden");
            }
        });
    };
    
    const showInlineMessage = (message, container, input, modalContainer, infoContainer) => {
        container.classList.remove("hidden");
        container.classList.add("err-inline");
        
        if (!(input.name === "confirm-password")) {
            showAbsoluteMessage(input, infoContainer, modalContainer);
        }
        
        container.textContent = message;
        container.style.width = `${input.offsetWidth}px`;

        input.style.border =  "2px #ff0000 solid";
        input.style.borderBottom =  "4px #ff0000 solid";
    };

    const simpleValidation = (min = 1, max = 255, value, container, input, modalContainer, infoContainer, progressElement, isForm) => {
        if (!isForm && input.name === "password") {
            strengthIndicatorPassword(progressElement, 25);
        }
        
        if (value.trim() === "") {
            isForm ? (input.isValid = false) : showInlineMessage("Empty input", container, input, modalContainer, infoContainer);
            return;
        }

        if (/\s/.test(value)) {
            isForm ? (input.isValid = false) : showInlineMessage("Spaces are not allowed", container, input, modalContainer, infoContainer);
            return;
        }

        if (value.length < min) {
            isForm ? (input.isValid = false) : showInlineMessage(`Input should be at least ${min} characters long`, container, input, modalContainer, infoContainer);
            return;
        }

        if (value.length > max) {
            isForm ? (input.isValid = false) : showInlineMessage(`Input should be at most ${max} characters long`, container, input, modalContainer, infoContainer);
            return;
        }

        if (!isForm && input.name === "password") {
            strengthIndicatorPassword(progressElement, 100);
        }

        return true;
    };

    const validateUsername = (value, container, input, modalContainer, infoContainer, isForm) => {
        const params = [
            // {reg: /[0-9]/g, message: "Should contain at least one digit"},
            {reg: /[A-Za-z]/g, message: "Should contain at least one letter"},
        ];

        if (!simpleValidation(4, 29, value, container, input, modalContainer, infoContainer, "", isForm)) {
            return;
        }
    
        params.forEach(obj => {
            const {reg, message} = obj;
    
            if (!reg.test(value)) {
                isForm ? (input.isValid = false) : showInlineMessage(message, container, input, modalContainer, infoContainer);
            }
        });
    }

    const validateEmail = (value, container, input, modalContainer, infoContainer, isForm) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!emailRegex.test(value)) {
            isForm ? (input.isValid = false) : showInlineMessage("Invalid email address", container, input, modalContainer, infoContainer);
        }
    };

    const validatePhone = (value, container, input, modalContainer, infoContainer, isForm) => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    
        if (!simpleValidation(10, 15, value, container, input, modalContainer, infoContainer, "", isForm)) {
            return;
        }
    
        if (!phoneRegex.test(value)) {
            isForm ? (input.isValid = false) : showInlineMessage("Invalid phone number", container, input, modalContainer, infoContainer);
        }
    };
    
    
    const validatePassword = async (value, usernameValue, container, input, modalContainer, progressElement, infoContainer, isForm) => {
        const params = [
            {reg: /[^A-Za-z0-9\s]/g, message: "Should contain at least one special character"},
            {reg: /[A-Z]/g, message: "Should contain at least one uppercase letter"},
            {reg: /[0-9]/g, message: "Should contain at least one digit"},
            {reg: /[a-z]/g, message: "Should contain at least one lowercase letter"},
        ];

        if (value.includes(usernameValue) && usernameValue) {
            isForm ? (input.isValid = false) : showInlineMessage("Password contain a username", container, input, modalContainer, infoContainer);
            isForm ? (input.isValid = false) : strengthIndicatorPassword(progressElement, 50);
            return;
        }

        if (!simpleValidation(20, 255, value, container, input, modalContainer, infoContainer, progressElement, isForm)) {
            return;
        }
    
        params.forEach(obj => {
            const {reg, message} = obj;
            
            if (!reg.test(value)) {
                isForm ? (input.isValid = false) : strengthIndicatorPassword(progressElement, 75);
                isForm ? (input.isValid = false) : showInlineMessage(message, container, input, modalContainer, infoContainer);
            }
        });
    };
    
    const validateConfirmPassword = (value, passwordValue, container, input, modalContainer, isForm) => {
        if (value !== passwordValue || passwordValue.length < 1) {
            isForm ? (input.isValid = false) : showInlineMessage("Passwords do not match", container, input, modalContainer);
        }
    };

    const strengthIndicatorPassword = (progressElement, progress) => {
        progressElement.classList.remove("progress-red")
        progressElement.classList.remove("progress-orange")
        progressElement.classList.remove("progress-yellow")
        progressElement.classList.remove("progress-green")

        progressElement.value = progress;

        if (progress === 25) {
            progressElement.classList.add("progress-red")
        } else if (progress === 50) {
            progressElement.classList.add("progress-orange")
        } else if (progress === 75) {
            progressElement.classList.add("progress-yellow")
        } else {
            progressElement.classList.add("progress-green")
        }
    };

    // ==============================================

    if (e.target.tagName === "FORM") {
        const data = Array.from(serializeForm(e.target).entries());
        const elementsFormNode = [...e.target.elements];
        let checkUsername = "";
        let checkPassValue = "";
        let isValidate = true;

        for (let index = 0; index < data.length; index++) {
            const [inputType, inputValue] = data[index];
            const input = elementsFormNode.find(el => el.name === inputType);
            input.isValid = true;

            switch(inputType) {
                case "username":
                    checkUsername = inputValue;
                    validateUsername(inputValue, "", input, "", "", true);
                    break;
                case "email":
                    validateEmail(inputValue, "", input, "", "", true);
                    break;
                case "tel":
                    validatePhone(inputValue, "", input, "", "", true);
                    break;                    
                case "password":
                    checkPassValue = inputValue;
                    validatePassword(inputValue, checkUsername, "", input, "", "", "", true);
                    break;
                case "confirm-password":
                    validateConfirmPassword(inputValue, checkPassValue, "", input, "", true);
                    break;
            }

            if (!input.isValid) {
                isValidate = false;
            }
        }

        if (!isValidate) {
            e.preventDefault();
        }

        return;
    }

    let checkUsername = e.target.form.querySelector("[name='username']").value;
    let checkPassValue = e.target.form.querySelector("[name='password']").value;
    let progressElement = "";

    addErrorContainerForFormElements(e.target);
    addModalContainerForFormElements(e.target);
    addStrengthIndicatorForPassword(e.target);
    addBtnPasswordVisibility(e.target);

    const validationContainer = e.target.parentElement.querySelector(`.err-${e.target.name}`);
    const modalContainer = document.querySelector(`.modal-${e.target.name}`);
    const infoContainer = e.target.parentElement.querySelector(`.err-absolute-${e.target.name}`);

    validationContainer.textContent = "";
    validationContainer.classList.add("hidden");

    e.target.style.border = "2px green solid";

    if (e.target.name === "password") {
        progressElement = e.target.nextElementSibling;
    }

    switch(e.target.name) {
        case "username":
            validateUsername(e.target.value, validationContainer, e.target, modalContainer, infoContainer, false);
            break;
        case "email":
            validateEmail(e.target.value, validationContainer, e.target, modalContainer, infoContainer, false);
            break;
        case "tel":
            validatePhone(e.target.value, validationContainer, e.target, modalContainer, infoContainer, false);
            break;
        case "password":
            validatePassword(e.target.value, checkUsername, validationContainer, e.target, modalContainer, progressElement, infoContainer, false);
            break;
        case "confirm-password":
            validateConfirmPassword(e.target.value, checkPassValue, validationContainer, e.target, modalContainer, false);
            break;
    }
}

const form = document.querySelector("form");

form.addEventListener("input", (e) => {
    formValidation(e);
});

form.addEventListener("submit", (e) => {
    formValidation(e);
});
