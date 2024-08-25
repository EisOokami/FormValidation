# Form Validation Project

## Project Overview

This project provides a comprehensive form validation system designed to ensure data integrity and enhance user experience. The main purpose of the project is to assist developers in implementing robust validation for form inputs, including username, email, and password fields. This validation framework is particularly useful for applications that require strict input criteria to prevent invalid data submissions.

## Features

- **Username Validation**
  - Must contain at least one letter.
  - Length between 4 to 29 characters.
  - No spaces allowed.

- **Email Validation**
  - Validates the input against standard email format.

- **Password Validation**
  - Must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.
  - Minimum length of 20 characters.
  - Cannot contain spaces or the username.
  - Strength indicator to display password strength.

- **Confirm Password Validation**
  - Ensures the password and confirm password fields match.

- **Inline Error Messaging**
  - Displays error messages inline with the corresponding input field.
  - Provides additional information on hover via a modal.

- **Password Visibility Toggle**
  - Users can toggle the visibility of the password for easier input.

## How It Works

The validation system operates by listening to form input events and validating each field according to its specific requirements. If an input fails validation, an error message is displayed, and the form submission is prevented until all fields are valid.

### Validation Process

1. **Username Validation**
   - Checks for presence of letters and ensures length constraints.

2. **Email Validation**
   - Validates format using a regular expression.

3. **Password Validation**
   - Checks for presence of uppercase letters, lowercase letters, digits, special characters, and ensures the length constraint is met.
   - Ensures the password does not contain the username.
   - Provides visual feedback on password strength.

4. **Confirm Password Validation**
   - Ensures the value matches the password field.

### Error Handling

Each input field has a corresponding error container that displays the validation message. Additionally, modal containers provide more detailed error messages on hover. This ensures users are informed about the validation criteria and can correct their inputs accordingly.

### Password Strength Indicator

A progress bar is displayed below the password field to indicate the strength of the password based on the validation rules. The strength indicator updates in real-time as the user types.

### Password Visibility Toggle

A toggle button is added next to the password fields to allow users to switch between masked and visible input, making it easier to enter and verify passwords.

## Usage

1. **Form Structure**
   - Include the necessary input fields for username, email, password, and confirm password.
   - Add the `novalidate` attribute to the form to prevent default browser validation.

2. **JavaScript Integration**
   - Include the validation script to handle input events and form submission.

## Project Setup

1. Clone the repository.
2. Ensure you have a `style.css` file in the `css` directory for styling.
3. Include the `validateForm.js` script in the `js` directory for validation logic.
4. Customize the validation messages and criteria as needed.

## Contributing

I welcome contributions to enhance this form validation system. If you find any issues or have suggestions for improvements, please submit a pull request or open an issue on GitHub.

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE. See the LICENSE file for details.

## Contact

For any questions or feedback, please reach out to the project maintainer.

---

Thank you for visiting the Form Validation project! I hope this tool will help you in protecting your form. If you have any questions or feedback, please feel free to open an issue or contribute to the project. Happy protection!