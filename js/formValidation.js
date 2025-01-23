const formValidation = (e) => {
    const serializeForm = (formNode) => {
        const inputsValidationUsername = document.querySelectorAll(
            "input[name='form-validation__username']",
        );
        const inputsValidationEmail = document.querySelectorAll(
            "input[name='form-validation__email']",
        );
        const inputsValidationTel = document.querySelectorAll(
            "input[name='form-validation__tel']",
        );
        const inputsValidationPassword = document.querySelectorAll(
            "input[name='form-validation__password']",
        );
        const inputsValidationPasswordConfirm = document.querySelectorAll(
            "input[name='form-validation__password--confirm']",
        );
        const inputsValidationCheckbox = document.querySelectorAll(
            "input[name='form-validation__required-checkbox']",
        );

        return [
            ...inputsValidationUsername,
            ...inputsValidationEmail,
            ...inputsValidationTel,
            ...inputsValidationPassword,
            ...inputsValidationPasswordConfirm,
            ...inputsValidationCheckbox,
        ];
    };

    const addErrorContainerForFormElements = (inputElement) => {
        if (
            inputElement.type === "password" ||
            inputElement.type === "text" ||
            inputElement.type === "email" ||
            inputElement.type === "tel"
        ) {
            let checkErrorElement = true;

            for (
                let i = 0;
                i < inputElement.parentElement.children.length;
                i++
            ) {
                if (
                    inputElement.parentElement.children[i].classList.contains(
                        `form-validation__error--${inputElement.name}`,
                    )
                ) {
                    checkErrorElement = false;
                }
            }

            if (checkErrorElement) {
                inputElement.insertAdjacentHTML(
                    "afterend",
                    `<div class='form-validation__hidden form-validation__error--all form-validation__error--${inputElement.name}'></div>`,
                );
            }
        }

        if (inputElement.type === "checkbox") {
            let checkErrorElement = true;

            for (
                let i = 0;
                i < inputElement.parentElement.parentElement.children.length;
                i++
            ) {
                if (
                    inputElement.parentElement.parentElement.children[
                        i
                    ].classList.contains(
                        `form-validation__error--${inputElement.name}`,
                    )
                ) {
                    checkErrorElement = false;
                }
            }

            if (checkErrorElement) {
                inputElement.parentElement.insertAdjacentHTML(
                    "afterend",
                    `<div class='form-validation__hidden form-validation__error--all form-validation__error--${inputElement.name}'></div>`,
                );
            }
        }
    };

    const addTooltipContainerForFormElements = (inputElement) => {
        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add(
            "form-validation__hidden",
            "form-validation__tooltip--all",
            `form-validation__tooltip--${inputElement.name}`,
        );
        tooltipElement.id = `form-validation__tooltip--${inputElement.name}`;

        if (
            (inputElement.type === "password" ||
                inputElement.type === "text" ||
                inputElement.type === "email" ||
                inputElement.type === "tel") &&
            !document.getElementById(
                `form-validation__tooltip--${inputElement.name}`,
            )
        ) {
            inputElement.insertAdjacentHTML(
                "afterend",
                `<div class="form-validation__hidden form-validation__error--absolute form-validation__error--absolute--${inputElement.name}"></div>`,
            );
            inputElement.insertAdjacentElement("afterend", tooltipElement);
        }
    };

    const addStrengthIndicatorForPassword = (inputElement) => {
        if (
            inputElement.type === "password" &&
            !inputElement.nextElementSibling.classList.contains(
                "form-validation__progress--all",
            ) &&
            !(inputElement.name === "form-validation__password--confirm")
        ) {
            inputElement.insertAdjacentHTML(
                "afterend",
                `<progress value="0" max="100" class='form-validation__progress--all class='form-validation__progress--${inputElement.name}'></progress>`,
            );
        }
    };

    const addBtnPasswordVisibility = (inputElement) => {
        const btnElement = document.createElement("div");

        btnElement.classList.add(
            "form-validation__visibility--all",
            "form-validation__btn--visibility",
            `form-validation__btn--${inputElement.name}`,
        );

        if (
            inputElement.type === "password" &&
            !(
                inputElement.previousElementSibling &&
                inputElement.previousElementSibling.classList.contains(
                    "form-validation__visibility--all",
                )
            )
        ) {
            inputElement.insertAdjacentElement("beforebegin", btnElement);

            btnElement.addEventListener("click", (e) => {
                togglePasswordVisibility(e, inputElement);
            });
        }
    };

    const togglePasswordVisibility = (e, input) => {
        if (input.type === "password") {
            e.target.classList.add("form-validation__visibility--all--off");
            e.target.classList.remove("form-validation__visibility--all");
            input.setAttribute("type", "text");
        } else {
            e.target.classList.add("form-validation__visibility--all");
            e.target.classList.remove("form-validation__visibility--all--off");
            input.setAttribute("type", "password");
        }
    };

    const showTooltipMessage = (message, tooltipContainer) => {
        tooltipContainer.classList.remove("form-validation__hidden");

        tooltipContainer.textContent = message;
    };

    const hideTooltipMessage = (tooltipContainer) => {
        tooltipContainer.classList.add("form-validation__hidden");
    };

    const showAbsoluteMessage = (input, container, tooltipContainer) => {
        let message = "";

        container.classList.remove("form-validation__hidden");
        container.classList.add("form-validation__error--absolute");

        switch (input.type) {
            case "password":
                message =
                    "Requires at least one uppercase letter, one lowercase letter, one digit, and one special character. Minimum 20 characters required";
                break;
            case "text":
                message =
                    "4-29 characters required. Must contain at least one letter";
                break;
            case "email":
                message =
                    "Ensure a valid email format (e.g., example@example.com)";
                break;
            case "tel":
                message =
                    "Enter a valid phone number in international format (e.g., +1234567890)";
                break;
        }

        hideTooltipMessage(tooltipContainer);

        container.addEventListener("mouseover", () => {
            showTooltipMessage(message, tooltipContainer);
        });
        container.addEventListener("mouseout", () => {
            hideTooltipMessage(tooltipContainer);
        });

        input.addEventListener("input", () => {
            if (input.checkValidity()) {
                container.classList.add("form-validation__hidden");
            }
        });
    };

    const showInlineMessage = (
        message,
        container,
        input,
        tooltipContainer,
        infoContainer,
    ) => {
        container.classList.remove("form-validation__hidden");
        container.classList.add("form-validation__error--inline");

        if (
            !(
                input.name === "form-validation__password--confirm" ||
                input.name === "form-validation__required-checkbox"
            )
        ) {
            showAbsoluteMessage(input, infoContainer, tooltipContainer);
        }

        container.textContent = message;

        if (!(input.name === "form-validation__required-checkbox")) {
            container.style.width = `${input.offsetWidth}px`;
        }
    };

    const simpleValidation = (
        min = 1,
        max = 255,
        value,
        container,
        input,
        tooltipContainer,
        infoContainer,
        progressElement,
        isForm,
    ) => {
        if (!isForm && input.name === "form-validation__password") {
            strengthIndicatorPassword(progressElement, 25);
        }

        if (value.trim() === "") {
            isForm
                ? (input.isValid = false)
                : showInlineMessage(
                      "Empty input",
                      container,
                      input,
                      tooltipContainer,
                      infoContainer,
                  );
            return;
        }

        if (/\s/.test(value)) {
            isForm
                ? (input.isValid = false)
                : showInlineMessage(
                      "Spaces are not allowed",
                      container,
                      input,
                      tooltipContainer,
                      infoContainer,
                  );
            return;
        }

        if (value.length < min) {
            isForm
                ? (input.isValid = false)
                : showInlineMessage(
                      `Input should be at least ${min} characters long`,
                      container,
                      input,
                      tooltipContainer,
                      infoContainer,
                  );
            return;
        }

        if (value.length > max) {
            isForm
                ? (input.isValid = false)
                : showInlineMessage(
                      `Input should be at most ${max} characters long`,
                      container,
                      input,
                      tooltipContainer,
                      infoContainer,
                  );
            return;
        }

        if (!isForm && input.name === "form-validation__password") {
            strengthIndicatorPassword(progressElement, 100);
        }

        return true;
    };

    const validateUsername = (
        value,
        container,
        input,
        tooltipContainer,
        infoContainer,
        isForm,
    ) => {
        const params = [
            // {reg: /[0-9]/g, message: "Should contain at least one digit"},
            { reg: /[A-Za-z]/g, message: "Should contain at least one letter" },
        ];

        if (
            !simpleValidation(
                4,
                29,
                value,
                container,
                input,
                tooltipContainer,
                infoContainer,
                "",
                isForm,
            )
        ) {
            return;
        }

        params.forEach((obj) => {
            const { reg, message } = obj;

            if (!reg.test(value)) {
                isForm
                    ? (input.isValid = false)
                    : showInlineMessage(
                          message,
                          container,
                          input,
                          tooltipContainer,
                          infoContainer,
                      );
            }
        });
    };

    const validateEmail = (
        value,
        container,
        input,
        tooltipContainer,
        infoContainer,
        isForm,
    ) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            isForm
                ? (input.isValid = false)
                : showInlineMessage(
                      "Invalid email address",
                      container,
                      input,
                      tooltipContainer,
                      infoContainer,
                  );
        }
    };

    const validatePhone = (
        value,
        container,
        input,
        tooltipContainer,
        infoContainer,
        isForm,
    ) => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;

        if (
            !simpleValidation(
                10,
                15,
                value,
                container,
                input,
                tooltipContainer,
                infoContainer,
                "",
                isForm,
            )
        ) {
            return;
        }

        if (!phoneRegex.test(value)) {
            isForm
                ? (input.isValid = false)
                : showInlineMessage(
                      "Invalid phone number",
                      container,
                      input,
                      tooltipContainer,
                      infoContainer,
                  );
        }
    };

    const validatePassword = (
        value,
        usernameValue,
        container,
        input,
        tooltipContainer,
        progressElement,
        infoContainer,
        isForm,
    ) => {
        const params = [
            {
                reg: /[^A-Za-z0-9\s]/g,
                message: "Should contain at least one special character",
            },
            {
                reg: /[A-Z]/g,
                message: "Should contain at least one uppercase letter",
            },
            { reg: /[0-9]/g, message: "Should contain at least one digit" },
            {
                reg: /[a-z]/g,
                message: "Should contain at least one lowercase letter",
            },
        ];

        if (value.includes(usernameValue) && usernameValue) {
            isForm
                ? (input.isValid = false)
                : showInlineMessage(
                      "Password contain a username",
                      container,
                      input,
                      tooltipContainer,
                      infoContainer,
                  );
            isForm
                ? (input.isValid = false)
                : strengthIndicatorPassword(progressElement, 50);
            return;
        }

        if (
            !simpleValidation(
                20,
                255,
                value,
                container,
                input,
                tooltipContainer,
                infoContainer,
                progressElement,
                isForm,
            )
        ) {
            return;
        }

        params.forEach((obj) => {
            const { reg, message } = obj;

            if (!reg.test(value)) {
                isForm
                    ? (input.isValid = false)
                    : strengthIndicatorPassword(progressElement, 75);
                isForm
                    ? (input.isValid = false)
                    : showInlineMessage(
                          message,
                          container,
                          input,
                          tooltipContainer,
                          infoContainer,
                      );
            }
        });
    };

    const validateConfirmPassword = (
        value,
        passwordValue,
        container,
        input,
        tooltipContainer,
        isForm,
    ) => {
        if (value !== passwordValue || passwordValue.length < 1) {
            isForm
                ? (input.isValid = false)
                : showInlineMessage(
                      "Passwords do not match",
                      container,
                      input,
                      tooltipContainer,
                  );
        }
    };

    const validateCheckbox = (input, container, tooltipContainer, isForm) => {
        if (!input.checked) {
            isForm
                ? (input.isValid = false)
                : showInlineMessage(
                      "This field is required",
                      container,
                      input,
                      tooltipContainer,
                  );
        }
    };

    const strengthIndicatorPassword = (progressElement, progress) => {
        progressElement.classList.remove("form-validation__progress--red");
        progressElement.classList.remove("form-validation__progress--orange");
        progressElement.classList.remove("form-validation__progress--yellow");
        progressElement.classList.remove("form-validation__progress--green");

        progressElement.value = progress;

        if (progress === 25) {
            progressElement.classList.add("form-validation__progress--red");
        } else if (progress === 50) {
            progressElement.classList.add("form-validation__progress--orange");
        } else if (progress === 75) {
            progressElement.classList.add("form-validation__progress--yellow");
        } else {
            progressElement.classList.add("form-validation__progress--green");
        }
    };

    // ==============================================

    if (e.target.tagName === "FORM") {
        // e.preventDefault();
        const data = serializeForm(e.target);
        const elementsFormNode = [...e.target.elements];
        let checkUsername = "";
        let checkPassValue = "";
        let isValidateData = [];
        let progressElement = "";

        for (let index = 0; index < data.length; index++) {
            const currentInput = data[index];
            const input = elementsFormNode.find(
                (el) => el.name === currentInput.name,
            );
            const inputValue = input.value;
            input.isValid = true;

            addErrorContainerForFormElements(input);
            addTooltipContainerForFormElements(input);
            addStrengthIndicatorForPassword(input);
            addBtnPasswordVisibility(input);

            const validationContainer =
                input.parentElement.parentElement.classList.contains(
                    "form-validation__input--wrapper",
                )
                    ? input.parentElement.parentElement.querySelector(
                          `.form-validation__error--${input.name}`,
                      )
                    : input.parentElement.querySelector(
                          `.form-validation__error--${input.name}`,
                      );
            const tooltipContainer = document.querySelector(
                `.form-validation__tooltip--${input.name}`,
            );
            const infoContainer =
                input.parentElement.parentElement.classList.contains(
                    "form-validation__input--wrapper",
                )
                    ? input.parentElement.parentElement.querySelector(
                          `.form-validation__error--absolute--${input.name}`,
                      )
                    : input.parentElement.querySelector(
                          `.form-validation__error--absolute--${input.name}`,
                      );

            validationContainer.textContent = "";
            validationContainer.classList.add("form-validation__hidden");

            if (input.name === "form-validation__password") {
                progressElement = input.nextElementSibling;
            }

            switch (input.name) {
                case "form-validation__username":
                    checkUsername = inputValue;
                    validateUsername(
                        inputValue,
                        validationContainer,
                        input,
                        tooltipContainer,
                        infoContainer,
                        false,
                    );
                    break;
                case "form-validation__email":
                    validateEmail(
                        inputValue,
                        validationContainer,
                        input,
                        tooltipContainer,
                        infoContainer,
                        false,
                    );
                    break;
                case "form-validation__tel":
                    validatePhone(
                        inputValue,
                        validationContainer,
                        input,
                        tooltipContainer,
                        infoContainer,
                        false,
                    );
                    break;
                case "form-validation__password":
                    checkPassValue = inputValue;
                    validatePassword(
                        inputValue,
                        checkUsername,
                        validationContainer,
                        input,
                        tooltipContainer,
                        progressElement,
                        infoContainer,
                        false,
                    );
                    break;
                case "form-validation__password--confirm":
                    validateConfirmPassword(
                        inputValue,
                        checkPassValue,
                        validationContainer,
                        input,
                        tooltipContainer,
                        false,
                    );
                    break;
                case "form-validation__required-checkbox":
                    validateCheckbox(
                        input,
                        validationContainer,
                        tooltipContainer,
                        false,
                    );
                    break;
            }

            if (
                validationContainer.classList.contains(
                    "form-validation__hidden",
                )
            ) {
                isValidateData.push(true);
            } else {
                isValidateData.push(false);
            }
        }

        const isValidate = isValidateData.includes(false);

        if (isValidate) {
            e.preventDefault();
        }

        return;
    }

    let checkUsername = e.target.form.querySelector(
        "[name='form-validation__username']",
    ).value;
    let checkPassValue = e.target.form.querySelector(
        "[name='form-validation__password']",
    ).value;
    let progressElement = "";

    addErrorContainerForFormElements(e.target);
    addTooltipContainerForFormElements(e.target);
    addStrengthIndicatorForPassword(e.target);
    addBtnPasswordVisibility(e.target);

    const validationContainer =
        e.target.parentElement.parentElement.classList.contains(
            "form-validation__input--wrapper",
        )
            ? e.target.parentElement.parentElement.querySelector(
                  `.form-validation__error--${e.target.name}`,
              )
            : e.target.parentElement.querySelector(
                  `.form-validation__error--${e.target.name}`,
              );
    const tooltipContainer = document.querySelector(
        `.form-validation__tooltip--${e.target.name}`,
    );
    const infoContainer =
        e.target.parentElement.parentElement.classList.contains(
            "form-validation__input--wrapper",
        )
            ? e.target.parentElement.parentElement.querySelector(
                  `.form-validation__error--absolute--${e.target.name}`,
              )
            : e.target.parentElement.querySelector(
                  `.form-validation__error--absolute--${e.target.name}`,
              );

    validationContainer.textContent = "";
    validationContainer.classList.add("form-validation__hidden");

    if (e.target.name === "form-validation__password") {
        progressElement = e.target.nextElementSibling;
    }

    switch (e.target.name) {
        case "form-validation__username":
            validateUsername(
                e.target.value,
                validationContainer,
                e.target,
                tooltipContainer,
                infoContainer,
                false,
            );
            break;
        case "form-validation__email":
            validateEmail(
                e.target.value,
                validationContainer,
                e.target,
                tooltipContainer,
                infoContainer,
                false,
            );
            break;
        case "form-validation__tel":
            validatePhone(
                e.target.value,
                validationContainer,
                e.target,
                tooltipContainer,
                infoContainer,
                false,
            );
            break;
        case "form-validation__password":
            validatePassword(
                e.target.value,
                checkUsername,
                validationContainer,
                e.target,
                tooltipContainer,
                progressElement,
                infoContainer,
                false,
            );
            break;
        case "form-validation__password--confirm":
            validateConfirmPassword(
                e.target.value,
                checkPassValue,
                validationContainer,
                e.target,
                tooltipContainer,
                false,
            );
            break;
        case "form-validation__required-checkbox":
            validateCheckbox(
                e.target,
                validationContainer,
                tooltipContainer,
                false,
            );
            break;
    }
};

const form = document.querySelector("form");

form.addEventListener("input", (e) => {
    formValidation(e);
});

form.addEventListener("submit", (e) => {
    formValidation(e);
});
