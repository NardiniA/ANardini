document.querySelector('form.contact__form').addEventListener('submit', (event) => {
    // Prevent From Submitting
    event.preventDefault();

    // Declares Vars
    const form = document.querySelector('form.contact__form');
    const fields = form.querySelectorAll('.contact__input');
    let data = [];

    // Loop through inputs
    fields.forEach((input, index) => {
        // Add field data to array
        data.push({
            name: input.name,
            id: input.id,
            type: input.type,
            value: input.value,
            index: index,
            valid: false,
            error: "",
            pattern: () => { if (input.type === "email") return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; else return /^[a-zA-Z'-,. ]{2,45}$/; }
        });
    });

    data.forEach((input) => {
        // Check if empty and length
        let mt = isEmpty(input.value);
        if (mt[0]) {
            // update array (valid)
            input.valid = mt[0]; input.error = mt[1];
        } else {
            // update array (invalid)
            input.valid = mt[0]; input.error = mt[1];
            return false;
        }
        // Regex Test
        if (patternMatchTest(input)) {
            // Update Array (valid)
            input.valid = true; input.error = "";
        } else {
            // Update Array (invalid)
            input.valid = false; input.error = "Invalid characters";
        }
    });

    removeErrors(form);

    if (data.every(input => { if (!input.valid) return false; else return true; })) {
        const formData = { name: data[0].value, email: data[1].value, subject: data[2].value, message: data[3].value };
        // Change to Loading Btn
        document.querySelector('button[type=submit]').innerHTML = 'Loading... <i class="uil uil-message button__icon"></i>';

        fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                service_id: "service_562kegs",
                template_id: "template_2owpp5u",
                user_id: "user_pwnrSymGTUtZ4MVyEqwmT",
                template_params: formData
            })
        })
        .then(response => response.text())
        .then(result => {
            // Change Loading Btn
            document.querySelector('button[type=submit]').innerHTML = 'Send Message <i class="uil uil-message button__icon"></i>';

            // Show Email Result
            removeErrors(form);
            showAlert(result);
        })
        .catch(error => {
            // Show Errors
            console.log("Oops... " + error);
        });
    } else {
        // Display Errors
        showErrors(data);
    }

    // Prevent from submitting
    event.preventDefault();
});

function removeErrors(form) {
    form.querySelectorAll('.contact__error-border').forEach(div => {
        div.classList.remove("contact__error-border");
        div.querySelector('.show-error').remove("show-error");
    });
    // form.querySelectorAll('.show-error').forEach(span => {
    //     span.classList.remove('show-error');
    // });
    form.querySelector('.alert').classList.remove("show-alert", "success", "error");
}

function showErrors(data) {
    // Display Errors
    data.forEach(input => {
        if (!input.valid) {
            let field = document.querySelectorAll('.contact__input')[input.index].parentElement;
            field.classList.add("contact__error-border");
            let box = field.querySelector('.contact__error');
            box.classList.add("show-error");
            box.querySelector('.error-msg').textContent = input.error;
        }
    });
    console.log("Invalid Form");
}

function showAlert(data) {
    let alert = document.querySelector('.alert');
    if (data === "Fail" || data === 400 || data === {}) {
        alert.classList.add("error", "show-alert");
        alert.querySelector('span').textContent = "Unable to send Email!";
    } else if (data === "OK" || data === 200) {
        alert.classList.add("success", "show-alert");
        alert.querySelector('span').textContent = "Email Sent!";
    }
}

function isEmpty(field) {
    if (!(field.length === 0 || field === "")) {
        if (field.length >= 2 && field.length <= 75) {
            // Valid
            return [true, ""];
        }
        // Too short or long
        return [false, "2-75 characters max."];
    }
    // Empty
    return [false, "Field is empty"];
}

// Test value against input type pattern (return true or false)
const patternMatchTest = (input) => { return input.pattern().test(input.value); }