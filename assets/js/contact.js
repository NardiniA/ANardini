function ValidateForm(event) {
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
        // Send to Backend
        console.log("Send to backend");
        const formData = JSON.stringify({ 'name': data[0].value, 'email': data[1].value, 'subject': data[2].value, 'message': data[3].value });
        fetch('assets/mail/contact.inc.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            console.log("Result");
            console.log(result);

            if (result.length === 2) {
                showAlert(result);
            } else if (result.length === 4) {
                showErrors(result);
            }
        })
        .catch(error => {
            console.log(error);
        });
        // fetch('assets/mail/contact.inc.php', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ 'name': "a", 'email': "tionard710@gmail.com", 'subject': 'Hello World', 'message': 'Message' })
        // })
        // .then(response => response.json())
        // .then(result => {
        //     console.log("Result");
        //     console.log(result);
        // })
        // .catch(error => {
        //     console.log(error);
        // });
    } else {
        // Display Errors
        showErrors(data);
    }

    // Prevent from submitting
    event.preventDefault();
}

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
    if (data[0] === 502) {
        alert.classList.add("error", "show-alert");
        alert.querySelector('span').textContent = data[1];
    } else if (data[0] === 200) {
        alert.classList.add("success", "show-alert");
        alert.querySelector('span').textContent = data[1];
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