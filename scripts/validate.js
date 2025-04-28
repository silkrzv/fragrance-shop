function isValidInput(value) {
    const regex = /^[A-Za-z0-9]+$/;
    return regex.test(value);
}

function updateValidationIndicator(inputElement) {
    const value = inputElement.value;
    const indicator = inputElement.nextElementSibling; 

    if (isValidInput(value)) {
        indicator.style.backgroundColor = "green"; 
    } else {
        indicator.style.backgroundColor = "red";
    }
}

function validateForm() {
    const firstName = document.getElementById("first_name");
    const lastName = document.getElementById("last_name");

    updateValidationIndicator(firstName);
    updateValidationIndicator(lastName);
}

// Adaugam event listener pentru a valida in timp real la schimbarea valorii
document.getElementById("first_name").addEventListener("input", function() {
    updateValidationIndicator(this);
});
document.getElementById("last_name").addEventListener("input", function() {
    updateValidationIndicator(this);
});

function isValidPassword(password) {
    // Verifică dacă parola conține litere mari, litere mici, cifre și caracterul '!'
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!]).+$/;
    return regex.test(password);
}

function updatePasswordValidationIndicator(inputElement) {
    const value = inputElement.value;
    const indicator = inputElement.nextElementSibling;

    if (isValidPassword(value)) {
        indicator.style.backgroundColor = "green";
    } else {
        indicator.style.backgroundColor = "red";
    }
}

// Adaugă event listener pentru câmpul de parolă
document.getElementById("password").addEventListener("input", function () {
    updatePasswordValidationIndicator(this);
});

function updateConfirmPasswordValidationIndicator(confirmPasswordElement) {
    const passwordElement = document.getElementById("password");
    const confirmPasswordValue = confirmPasswordElement.value;
    const passwordValue = passwordElement.value;
    const indicator = confirmPasswordElement.nextElementSibling;

    // Verifică dacă parola inițială este validă
    if (!isValidPassword(passwordValue)) {
        indicator.style.backgroundColor = "red"; 
        return;
    }

    // Verifică dacă parolele sunt identice
    if (confirmPasswordValue === passwordValue && confirmPasswordValue !== "") {
        indicator.style.backgroundColor = "green"; 
    } else {
        indicator.style.backgroundColor = "red";
    }
}

// Adaugă event listener pentru câmpul Confirm Password
document.getElementById("confirm_password").addEventListener("input", function () {
    updateConfirmPasswordValidationIndicator(this);
});

// Adaugă event listener pentru câmpul Password pentru a actualiza și Confirm Password
document.getElementById("password").addEventListener("input", function () {
    const confirmPasswordElement = document.getElementById("confirm_password");
    updateConfirmPasswordValidationIndicator(confirmPasswordElement);
});

function isValidEmail(email) {
    // Verifică dacă email-ul conține doar litere, cifre, caracterul '_' și respectă regulile de validare
    const regex = /^[A-Za-z0-9_.]+@[A-Za-z]+\.[A-Za-z]+$/;
    return regex.test(email);
}

function updateEmailValidationIndicator(inputElement) {
    const value = inputElement.value;
    const indicator = inputElement.nextElementSibling;

    if (isValidEmail(value)) {
        indicator.style.backgroundColor = "green";
    } else {
        indicator.style.backgroundColor = "red"; 
    }
}

// Adaugă event listener pentru câmpul Email
document.getElementById("email").addEventListener("input", function () {
    updateEmailValidationIndicator(this);
});

function isValidPhoneNumber(value) {
    const regex = /^\(\+\d+\)\s\d{3}\s\d{3}\s\d{3}$/;
    return regex.test(value);
}


function updatePhoneValidationIndicator(inputElement) {
    const value = inputElement.value;
    const indicator = inputElement.nextElementSibling;

    if (isValidPhoneNumber(value.trim())) {
        indicator.style.backgroundColor = "green"; 
    } else {
        indicator.style.backgroundColor = "red"; 
    }
}

// Adaugă event listener pentru câmpul Phone Number
document.getElementById("phone").addEventListener("input", function () {
    updatePhoneValidationIndicator(this);
});

function validateDate(dateString, format) {
    const dateParts = dateString.split('/');
    let day, month, year;

    // Maparea formatului
    if (format === 'zz/ll/aaaa') {
        [day, month, year] = dateParts.map(Number);
    } else if (format === 'll/zz/aaaa') {
        [month, day, year] = dateParts.map(Number);
    } else if (format === 'zz/ll/aa') {
        [day, month, year] = dateParts.map(Number);
        year += 2000; // Transformă anul în format complet
    } else {
        return false; // Format necunoscut
    }

    // Verifică dacă anul are exact 4 cifre
    if (!/^\d{4}$/.test(String(year))) {
        return false;
    }

    // Verifică dacă valorile sunt valide
    if (!day || !month || !year || day < 1 || month < 1 || month > 12) {
        return false;
    }

    // Verifică numărul de zile din lună
    const daysInMonth = new Date(year, month, 0).getDate();
    return day <= daysInMonth;
}

function updateDateValidationIndicator(inputElement) {
    const value = inputElement.value; // Valoarea este în formatul aaaa-ll-zz
    const indicator = inputElement.nextElementSibling;

    // Convertim formatul aaaa-ll-zz în zz/ll/aaaa
    const [year, month, day] = value.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    if (validateDate(formattedDate, 'zz/ll/aaaa')) {
        indicator.style.backgroundColor = "green";
    } else {
        indicator.style.backgroundColor = "red"; 
    }
}

// Adaugă event listener pentru câmpul Date of Birth
document.getElementById("dob").addEventListener("input", function () {
    updateDateValidationIndicator(this);
});

function validateFormOnSubmit(event) {
    let isValid = true;

    // Validare First Name
    const firstName = document.getElementById("first_name");
    if (!isValidInput(firstName.value)) {
        updateValidationIndicator(firstName);
        isValid = false;
    }

    // Validare Last Name
    const lastName = document.getElementById("last_name");
    if (!isValidInput(lastName.value)) {
        updateValidationIndicator(lastName);
        isValid = false;
    }

    // Validare Email
    const email = document.getElementById("email");
    if (!isValidEmail(email.value)) {
        updateEmailValidationIndicator(email);
        isValid = false;
    }

    // Validare Password
    const password = document.getElementById("password");
    if (!isValidPassword(password.value)) {
        updatePasswordValidationIndicator(password);
        isValid = false;
    }

    // Validare Confirm Password
    const confirmPassword = document.getElementById("confirm_password");
    if (confirmPassword.value !== password.value || !isValidPassword(password.value)) {
        updateConfirmPasswordValidationIndicator(confirmPassword);
        isValid = false;
    }

    // Validare Date of Birth
    const dob = document.getElementById("dob");
    const dobValue = dob.value; // Format aaaa-ll-zz
    const [year, month, day] = dobValue.split('-');
    const formattedDob = `${day}/${month}/${year}`;
    if (!validateDate(formattedDob, 'zz/ll/aaaa')) {
        updateDateValidationIndicator(dob);
        isValid = false;
    }

    // Validare Phone Number
    const phone = document.getElementById("phone");
    if (!isValidPhoneNumber(phone.value)) {
        updatePhoneValidationIndicator(phone);
        isValid = false;
    }

    // Validare Terms and Conditions
    const terms = document.querySelector("input[name='terms']");
    if (!terms.checked) {
        alert("You must agree to the Terms and Conditions.");
        isValid = false;
    }

    if (!isValid) {
        alert("Please correct the errors in the form.");
        window.location.href = "sign_up.html"; 
    } else {
        alert("Form submitted successfully!");
        window.location.href = "index.html";
    }
}

// Adaugă event listener pentru formular
document.querySelector("form").addEventListener("submit", validateFormOnSubmit);
