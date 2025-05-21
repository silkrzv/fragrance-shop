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

document.getElementById("first_name").addEventListener("input", function () {
  updateValidationIndicator(this);
});
document.getElementById("last_name").addEventListener("input", function () {
  updateValidationIndicator(this);
});

function isValidPassword(password) {
  // Verifica daca parola contine litere mari, litere mici, cifre si caracterul '!'
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

document.getElementById("password").addEventListener("input", function () {
  updatePasswordValidationIndicator(this);
});

function updateConfirmPasswordValidationIndicator(confirmPasswordElement) {
  const passwordElement = document.getElementById("password");
  const confirmPasswordValue = confirmPasswordElement.value;
  const passwordValue = passwordElement.value;
  const indicator = confirmPasswordElement.nextElementSibling;

  if (!isValidPassword(passwordValue)) {
    indicator.style.backgroundColor = "red";
    return;
  }

  if (confirmPasswordValue === passwordValue && confirmPasswordValue !== "") {
    indicator.style.backgroundColor = "green";
  } else {
    indicator.style.backgroundColor = "red";
  }
}

document
  .getElementById("confirm_password")
  .addEventListener("input", function () {
    updateConfirmPasswordValidationIndicator(this);
  });

document.getElementById("password").addEventListener("input", function () {
  const confirmPasswordElement = document.getElementById("confirm_password");
  updateConfirmPasswordValidationIndicator(confirmPasswordElement);
});

function isValidEmail(email) {
  // Verifica daca email-ul contine doar litere, cifre, caracterul '_' si respecta regulile de validare
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

document.getElementById("phone").addEventListener("input", function () {
  updatePhoneValidationIndicator(this);
});

function validateDate(dateString, format) {
  const dateParts = dateString.split("/");
  let day, month, year;

  if (format === "zz/ll/aaaa") {
    [day, month, year] = dateParts.map(Number);
  } else if (format === "ll/zz/aaaa") {
    [month, day, year] = dateParts.map(Number);
  } else if (format === "zz/ll/aa") {
    [day, month, year] = dateParts.map(Number);
    year += 2000;
  } else {
    return false;
  }

  // Verifica daca anul are exact 4 cifre
  if (!/^\d{4}$/.test(String(year))) {
    return false;
  }

  if (!day || !month || !year || day < 1 || month < 1 || month > 12) {
    return false;
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  return day <= daysInMonth;
}

function updateDateValidationIndicator(inputElement) {
  const value = inputElement.value; // Valoarea este în formatul aaaa-ll-zz
  const indicator = inputElement.nextElementSibling;

  // Convertim formatul aaaa-ll-zz în zz/ll/aaaa
  const [year, month, day] = value.split("-");
  const formattedDate = `${day}/${month}/${year}`;

  if (validateDate(formattedDate, "zz/ll/aaaa")) {
    indicator.style.backgroundColor = "green";
  } else {
    indicator.style.backgroundColor = "red";
  }
}

document.getElementById("dob").addEventListener("input", function () {
  updateDateValidationIndicator(this);
});

function validateFormOnSubmit(form) {
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
  if (
    confirmPassword.value !== password.value ||
    !isValidPassword(password.value)
  ) {
    updateConfirmPasswordValidationIndicator(confirmPassword);
    isValid = false;
  }

  // Validare Date of Birth
  const dob = document.getElementById("dob");
  const dobValue = dob.value; // Format aaaa-ll-zz
  if (!dobValue) {
    updateDateValidationIndicator(dob);
    isValid = false;
  } else {
    const [year, month, day] = dobValue.split("-");
    const formattedDob = `${day}/${month}/${year}`;
    if (!validateDate(formattedDob, "zz/ll/aaaa")) {
      updateDateValidationIndicator(dob);
      isValid = false;
    }
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
    alert("Trebuie să fii de acord cu Termenii și Condițiile.");
    isValid = false;
  }

  if (!isValid) {
    alert("Te rugăm să corectezi erorile din formular.");
  }

  return isValid;
}
