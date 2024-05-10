const validateFormSecond = (e, errorType) => {
    const serializeForm = (formNode) => {
        return new FormData(formNode);
    };

    const addErrorContainerForFormElements = (formNode) => {
        formNode.forEach((element) => {
            if (!(element.type === "submit" || element.type === "radio" || element.type === "checkbox") && element.nextElementSibling === null) {
                element.insertAdjacentHTML("afterend", "<div class='hidden err-all'></div>");
            }
        });
    };

    const addModalContainerForFormElements = (formNode) => {
        formNode.forEach((element, index) => {
            const modalElement = document.createElement("div");
            modalElement.classList.add("hidden", "modal-all");
            modalElement.id = `${index}`;

            if (!(element.type === "submit" || element.type === "radio" || element.type === "checkbox") && !document.getElementById(`${index}`)) {
                document.body.append(modalElement);
            }
        });
    };

    const showModalMessage = (message, container, modalContainer) => {
        modalContainer.classList.remove("hidden");

        const iconPosition = container.getBoundingClientRect();
        modalContainer.style.left = `${iconPosition.right}px`;
        modalContainer.style.top = `${window.scrollY + iconPosition.top - 10}px`;

        modalContainer.textContent = message;
    };

    const hideModalMessage = (modalContainer) => {
        modalContainer.classList.add("hidden");
    };

    const showAbsoluteMessage = (message, container, input, modalContainer) => {
        checkValidate = false;
        container.classList.remove("hidden");
        container.classList.add("err-absolute");

        container.addEventListener("mouseover", () => {
            showModalMessage(message, container, modalContainer);
        });
        container.addEventListener("mouseout", () => {
            hideModalMessage(modalContainer);
        });

        input.style.border =  "2px #ff0000 solid";
        input.style.borderBottom =  "4px #ff0000 solid";
    };

    const showInlineMessage = (message, container, input) => {
        checkValidate = false;
        container.classList.remove("hidden");
        container.classList.add("err-inline");

        container.textContent = message;
        container.style.width = `${e.target.offsetWidth}px`;

        input.style.border =  "2px #ff0000 solid";
        input.style.borderBottom =  "4px #ff0000 solid";
    };

    const validateUsername = (value, container, func, input, modalContainer) => {
        const stringRegex = /^[A-Za-z][A-Za-z0-9_]{4,29}$/;

        if (!stringRegex.test(value)) {
            func("Invalid username", container, input, modalContainer);
        }
    }

    const validateEmail = (value, container, func, input, modalContainer) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!emailRegex.test(value)) {
            func("Invalid email address", container, input, modalContainer);
        }
    };
    
    const validatePassword = (value, container, func, input, modalContainer) => {
        if (value.trim() === "") {
            func("Empty input", container, input, modalContainer);
            return;
        }
    
        if (value.length < 8) {
            func("Password should be at least 8 characters long", container, input, modalContainer);
            return;
        }

        if (value.length > 255) {
            func("Password should be at most 255 characters long", container, input, modalContainer);
            return;
        }
    
        if (/\s/.test(value)) {
            func("Spaces are not allowed", container, input, modalContainer);
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
                func(message, container, input, modalContainer);
            }
        });
    };
    
    const validateConfirmPassword = (value, passwordValue, container, func, input, modalContainer) => {
        if (value !== passwordValue || passwordValue.length < 8) {
            func("Passwords do not match", container, input, modalContainer);
        }
    };

    // ==============================================

    const data = Array.from(serializeForm(e.target).entries());
    const showErrorMessage = errorType === "absolute" ? showAbsoluteMessage : showInlineMessage;
    const elementsFormNode = [...e.target.elements];
    let checkPassValue = "";
    let checkValidate = true;

    addErrorContainerForFormElements(elementsFormNode);
    addModalContainerForFormElements(elementsFormNode);

    const validationContainers = [...e.target.querySelectorAll(".err-all")];
    const modalContainers = [...document.querySelectorAll(".modal-all")];

    data.forEach((element, index) => {
        const [inputType, inputValue] = element;
        const input = elementsFormNode[index];

        validationContainers[index].textContent = "";
        validationContainers[index].classList.add("hidden");

        input.style.border = "2px green solid";

        switch(inputType) {
            case "username":
                validateUsername(inputValue, validationContainers[index], showErrorMessage, input, modalContainers[index]);
                break;
            case "email":
                validateEmail(inputValue, validationContainers[index], showErrorMessage, input, modalContainers[index]);
                break;
            case "password":
                checkPassValue = inputValue;
                validatePassword(inputValue, validationContainers[index], showErrorMessage, input, modalContainers[index]);
                break;
            case "confirm-password":
                validateConfirmPassword(inputValue, checkPassValue, validationContainers[index], showErrorMessage, input, modalContainers[index]);
                break;
            default:
                showInlineMessage("Unknown input type", validationContainers[index], input);
                break;
        }
    });

    if (!checkValidate) {
        e.preventDefault();
    }
}

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    validateFormSecond(e, "absolute");
});