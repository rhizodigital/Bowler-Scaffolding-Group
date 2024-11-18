import isEmail from "validator/lib/isEmail";
import isAlpha from "validator/lib/isAlpha";

type FormControlElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export class ContactFormElement extends HTMLElement {
  private form!: HTMLFormElement;
  private inputs: Record<string, FormControlElement> = {};
  private submitButton!: HTMLButtonElement;
  private isSending: boolean = false;
  private errorMessageElement!: HTMLDivElement;
  private successMessageElement!: HTMLDivElement;
  private honeypotField!: HTMLInputElement;
  private privacyCheckbox!: HTMLInputElement;

  constructor() {
    super();
  }

  connectedCallback() {
    // Get form element and check if it exists
    const form = this.querySelector("form");
    if (form && form instanceof HTMLFormElement) {
      this.form = form;
    } else {
      console.warn("Form element is missing in the HTML");
      return;
    }

    // Get the inputs for validation
    this.inputs = {
      name: this.querySelector('input[name="name"]') as HTMLInputElement,
      email: this.querySelector('input[name="email"]') as HTMLInputElement,
      phone: this.querySelector('input[name="phone"]') as HTMLInputElement,
      subject: this.querySelector(
        'select[name="subject"]'
      ) as HTMLSelectElement,
      message: this.querySelector(
        'textarea[name="message"]'
      ) as HTMLTextAreaElement,
    };

    // If any input field is missing, stop the script and log an error
    if (Object.values(this.inputs).some((input) => !input)) {
      console.warn("One or more input fields are missing in the HTML");
      return;
    }

    // Get the honeypot and privacy checkbox
    this.honeypotField = this.querySelector(
      'input[name="manuca"]'
    ) as HTMLInputElement;
    this.privacyCheckbox = this.querySelector(
      'input[name="privacy_policy"]'
    ) as HTMLInputElement;

    if (!this.honeypotField || !this.privacyCheckbox) {
      console.warn("Honeypot field or privacy checkbox is missing");
      return;
    }

    // Get the submit button
    this.submitButton = this.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;

    // Add event listeners
    this.setupValidationListeners();
    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  setupValidationListeners() {
    // Add event listeners to each input for validation
    Object.entries(this.inputs).forEach(([field, input]) => {
      input.addEventListener("input", () => this.validateField(field, input));
      input.addEventListener("blur", () => this.validateField(field, input));
    });
  }

  validateField(field: string, input: FormControlElement): boolean {
    // Set isValid to true by default
    let isValid = true;
    let message = "";
    if (!input.checkValidity()) {
      // Do standard HTML5 validation
      isValid = false;
      message = input.validationMessage;
    } else {
      // Custom validator.js validation
      const value = input.value;
      switch (field) {
        case "name":
          if (!isAlpha(value, "en-GB", { ignore: " " })) {
            isValid = false;
            message = "Name can only contain letters and spaces";
          } else if (value.length < 2) {
            isValid = false;
            message = "Name must be at least 2 characters";
          }
          break;
        case "email":
          if (!isEmail(value)) {
            isValid = false;
            message = "Please enter a valid email address";
          }
          break;
        case "phone":
          const phoneRegex =
            /^[/+]?(?:\d{1,4})[ ]?[( ]?(?:\d{1,4})[ )]?\s?(?:\d{1,4})[-. ]?(?:\d{1,4})[-. ]?(?:\d{1,4})[-. ]?(?:\d{1,9})$/;
          if (!phoneRegex.test(value)) {
            isValid = false;
            message = "Please enter a valid phone number";
          }
          break;
        case "message":
          if (value.length < 10) {
            isValid = false;
            message = "Message must be at least 10 characters";
          }
          break;
      }
    }

    this.updateFieldValidationUI(input, isValid, message);
    return isValid;
  }

  validateHoneypot(): boolean {
    if (this.honeypotField.value) {
      this.showErrorMessage("Spam detected");
      return false;
    }
    return true;
  }

  validatePrivacyCheckbox(): boolean {
    if (!this.privacyCheckbox.checked) {
      this.showErrorMessage("Please accept the Privacy Policy");
      return false;
    }
    return true;
  }

  updateFieldValidationUI(
    input: FormControlElement,
    isValid: boolean,
    message: string
  ) {
    // Get the error message element
    const inputErrorElement = input.nextElementSibling;
    // Check if the error message element exists
    if (
      !inputErrorElement ||
      !inputErrorElement.hasAttribute("data-input-error")
    ) {
      console.warn(
        `Error message element is missing in the input field: ${input.name}`
      );
      return;
    }

    // Set input attribute to valid or not valid
    input.setAttribute("data-input-valid", isValid.toString());

    // If valid, remove error message and hide it
    inputErrorElement.textContent = "";
    if (!inputErrorElement.classList.contains("hidden")) {
      inputErrorElement.classList.add("hidden");
    }

    // If not valid, add error message
    if (!isValid) {
      inputErrorElement.textContent = message;
      if (inputErrorElement.classList.contains("hidden")) {
        inputErrorElement.classList.remove("hidden");
      }
      return;
    }
  }

  validateForm(): boolean {
    // Check if all fields are valid with every which checks all fields and returns true if all are valid
    // Also check honeypot and privacy checkbox if both are valid
    return (
      Object.entries(this.inputs).every(([field, input]) =>
        this.validateField(field, input)
      ) &&
      this.validateHoneypot() &&
      this.validatePrivacyCheckbox()
    );
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    if (this.isSending) {
      return;
    }

    this.sendingStatus(true);

    if (this.form.checkValidity() && this.validateForm()) {
      await this.sendMessage();
    } else {
      this.showErrorMessage("Please fill in the form correctly");
      this.form.reportValidity();
      this.validateHoneypot();
      this.validatePrivacyCheckbox();
    }

    this.sendingStatus(false);
  }

  sendingStatus(status: boolean) {
    this.submitButton.disabled = status;
    const indicator = this.form.querySelector("[data-form-indicator]");
    if (indicator) {
      indicator.classList.toggle("hidden", !status);
    }

    const buttonText = this.submitButton.querySelector(
      "[data-form-submit-text]"
    );
    if (buttonText) {
      buttonText.textContent = status ? "Sending..." : "Send Message";
    }
    this.isSending = status;
  }

  async sendMessage() {
    try {
      const formData = new FormData(this.form);

      const response = await fetch(`${import.meta.env.PUBLIC_CONTACT_URL}`, {
        method: "POST",
        body: formData,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const result = await response.json(); // Get raw response as text

      // Now handle the parsed result
      if (result.status) {
        this.form.reset();
        this.showSuccessMessage();
      } else {
        this.showErrorMessage(result.message, !result.status);
      }
    } catch (error) {
      this.showErrorMessage("An error occurred while sending the message");
    }
  }

  showErrorMessage(message: string, visible: boolean = true) {
    const node = this.form.querySelector("[data-form-error]");

    if (node && node instanceof HTMLDivElement) {
      this.errorMessageElement = node as HTMLDivElement;
    } else {
      console.warn("Error message element is missing in the HTML");
      return;
    }
    this.errorMessageElement.setAttribute(
      "data-form-error",
      visible.toString()
    );
    const errorTextElement = this.errorMessageElement.querySelector(
      "[data-form-error-text]"
    );
    if (errorTextElement) {
      errorTextElement.textContent = message;
    }
  }

  showSuccessMessage() {
    this.showErrorMessage("", false);
    const node = this.form.querySelector("[data-form-success]");
    if (node && node instanceof HTMLDivElement) {
      this.successMessageElement = node as HTMLDivElement;
      this.successMessageElement.setAttribute("data-form-success", "true");
      const button = this.successMessageElement.querySelector("button");
      if (button) {
        button.focus();
        const closeHandler = () => {
          this.successMessageElement.setAttribute("data-form-success", "false");
          button.removeEventListener("click", closeHandler);
        };

        button.addEventListener("click", () => closeHandler());
      }
    }
  }
}

if (typeof window !== "undefined") {
  customElements.define("contact-form", ContactFormElement);
}

declare global {
  interface HTMLElementTagNameMap {
    "contact-form": ContactFormElement;
  }
}
