const validateFormSecond = (e) => {
    const serializeForm = (formNode) => {
        return new FormData(formNode);
    };

    const addErrorContainerForFormElements = (formNode) => {
        formNode.forEach((element) => {
            if (element.type === "password" || element.type === "text" || element.type === "email") {
                let checkErrorElement = true;

                for (let i = 0; i < element.parentElement.children.length; i++) {
                    if (element.parentElement.children[i].classList.contains("err-all")) {
                        checkErrorElement = false;
                    }
                }

                if (checkErrorElement) {
                    element.insertAdjacentHTML("afterend", "<div class='hidden err-all'></div>");
                }
            }
        });
    };

    const addModalContainerForFormElements = (formNode) => {
        formNode.forEach((element, index) => {
            const modalElement = document.createElement("div");
            modalElement.classList.add("hidden", "modal-all");
            modalElement.id = `${index}`;

            if ((element.type === "password" || element.type === "text" || element.type === "email") && !document.getElementById(`${index}`)) {
                element.insertAdjacentHTML("afterend", `<div class="hidden err-absolute"></div>`);
                element.insertAdjacentElement("afterend", modalElement);
            }
        });
    };

    const addStrengthIndicatorForPassword = (formNode) => {
        formNode.forEach((element) => {
            if (element.type === "password" && !element.nextElementSibling.classList.contains("progress-all") && !(element.name === "confirm-password")) {
                element.insertAdjacentHTML("afterend", `<progress value="0" max="100" class='progress-all'></progress>`);
            }
        });
    };

    const addBtnPasswordVisibility = (formNode) => {
        formNode.forEach((element) => {
            const btnElement = document.createElement("div");

            btnElement.classList.add("visibility-all", "btn-visibility");
            
            if (element.type === "password" && !(element.previousElementSibling.classList.contains("visibility-all"))) {
                element.insertAdjacentElement("beforebegin", btnElement);

                btnElement.addEventListener("click", (e) => {
                    togglePasswordVisibility(e, element);
                });
            }
        });
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
        checkValidate = false;
        container.classList.remove("hidden");
        container.classList.add("err-inline");
        
        if (!(input.name === "confirm-password")) {
            showAbsoluteMessage(input, infoContainer, modalContainer);
        }
        
        container.textContent = message;
        container.style.width = `${e.target.offsetWidth}px`;

        input.style.border =  "2px #ff0000 solid";
        input.style.borderBottom =  "4px #ff0000 solid";
    };

    const simpleValidation = (min = 1, max = 255, value, container, input, modalContainer, infoContainer, progressElement) => {
        if (input.name === "password") {
            strengthIndicatorPassword(progressElement, 25);
        }
        
        if (value.trim() === "") {
            showInlineMessage("Empty input", container, input, modalContainer, infoContainer);
            return;
        }

        if (/\s/.test(value)) {
            showInlineMessage("Spaces are not allowed", container, input, modalContainer, infoContainer);
            return;
        }

        if (value.length < min) {
            showInlineMessage(`Input should be at least ${min} characters long`, container, input, modalContainer, infoContainer);
            return;
        }

        if (value.length > max) {
            showInlineMessage(`Input should be at most ${max} characters long`, container, input, modalContainer, infoContainer);
            return;
        }

        if (input.name === "password") {
            strengthIndicatorPassword(progressElement, 100);
        }

        return true;
    };

    const validateUsername = (value, container, input, modalContainer, infoContainer) => {
        const params = [
            // {reg: /[0-9]/g, message: "Should contain at least one digit"},
            {reg: /[A-Za-z]/g, message: "Should contain at least one letter"},
        ];

        if (!simpleValidation(4, 29, value, container, input, modalContainer, infoContainer)) {
            return;
        }
    
        params.forEach(obj => {
            const {reg, message} = obj;
    
            if (!reg.test(value)) {
                showInlineMessage(message, container, input, modalContainer, infoContainer);
            }
        });
    }

    const validateEmail = (value, container, input, modalContainer, infoContainer) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!emailRegex.test(value)) {
            showInlineMessage("Invalid email address", container, input, modalContainer, infoContainer);
        }
    };
    
    const validatePassword = async (value, usernameValue, container, input, modalContainer, progressElement, infoContainer) => {
        const params = [
            {reg: /[^A-Za-z0-9\s]/g, message: "Should contain at least one special character"},
            {reg: /[A-Z]/g, message: "Should contain at least one uppercase letter"},
            {reg: /[0-9]/g, message: "Should contain at least one digit"},
            {reg: /[a-z]/g, message: "Should contain at least one lowercase letter"},
        ];

        const response = await fetch("../json/pass.json");
        const json = await response.json();
        const popularPasswords = Object.values(json);

        if (popularPasswords.includes(value)) {
            showInlineMessage("This password is commonly used", container, input, modalContainer, infoContainer);
            strengthIndicatorPassword(progressElement, 25);
            return;
        }

        if (value.includes(usernameValue) && usernameValue) {
            showInlineMessage("Password contain a username", container, input, modalContainer, infoContainer);
            strengthIndicatorPassword(progressElement, 50);
            return;
        }

        if (!simpleValidation(20, 255, value, container, input, modalContainer, infoContainer, progressElement)) {
            return;
        }
    
        params.forEach(obj => {
            const {reg, message} = obj;
    
            
            if (!reg.test(value)) {
                strengthIndicatorPassword(progressElement, 75);
                showInlineMessage(message, container, input, modalContainer, infoContainer);
            }
        });
    };
    
    const validateConfirmPassword = (value, passwordValue, container, input, modalContainer) => {
        if (value !== passwordValue || passwordValue.length < 1) {
            showInlineMessage("Passwords do not match", container, input, modalContainer);
        }
    };

    const strengthIndicatorPassword = (progressElement, progress) => {
        progressElement.value = progress;
    };

    // ==============================================

    const data = Array.from(serializeForm(e.target).entries());
    const elementsFormNode = [...e.target.elements];
    let checkUsername = "";
    let checkPassValue = "";
    let checkValidate = true;

    addErrorContainerForFormElements(elementsFormNode);
    addModalContainerForFormElements(elementsFormNode);
    addStrengthIndicatorForPassword(elementsFormNode);
    addBtnPasswordVisibility(elementsFormNode);

    const validationContainers = [...e.target.querySelectorAll(".err-all")];
    const modalContainers = [...document.querySelectorAll(".modal-all")];
    const infoContainers = [...e.target.querySelectorAll(".err-absolute")];

    for (let index = 0; index < data.length; index++) {
        const [inputType, inputValue] = data[index];
        const input = elementsFormNode[index];
        let progressElement = "";

        validationContainers[index].textContent = "";
        validationContainers[index].classList.add("hidden");

        input.style.border = "2px green solid";

        if (elementsFormNode[index].name === "password") {
            progressElement = elementsFormNode[index].nextElementSibling;
        }

        switch(inputType) {
            case "username":
                checkUsername = inputValue;
                validateUsername(inputValue, validationContainers[index], input, modalContainers[index], infoContainers[index]);
                break;
            case "email":
                validateEmail(inputValue, validationContainers[index], input, modalContainers[index], infoContainers[index]);
                break;
            case "password":
                checkPassValue = inputValue;
                validatePassword(inputValue, checkUsername, validationContainers[index], input, modalContainers[index], progressElement, infoContainers[index]);
                break;
            case "confirm-password":
                validateConfirmPassword(inputValue, checkPassValue, validationContainers[index], input, modalContainers[index], infoContainers[index]);
                break;
        }
    }

    if (!checkValidate) {
        e.preventDefault();
    }
}

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    validateFormSecond(e);
});