document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.signup-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Verifică dacă funcția validateSignupForm există și o apelează
    if (typeof validateFormOnSubmit === 'function') {
      const isValid = validateFormOnSubmit(form);
      if (!isValid) {
        alert('Te rugăm să corectezi erorile din formular.');
        return; // Oprește trimiterea dacă formularul nu este valid
      }
    }

    // Colectează datele din formular
    const formData = {
      first_name: form.first_name.value.trim(),
      last_name: form.last_name.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      confirm_password: form.confirm_password.value,
      dob: form.dob.value,
      country: form.country.value,
      phone: form.phone.value.trim(),
      gender: form.gender.value,
      judet: form.judet.value,
      oras: form.oras.value,
      terms: form.terms.checked
    };

    // Trimite datele către API
    try {
  const res = await fetch('/fragrance_shop/api/controllers/signup_process.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  const text = await res.text();
  console.log("Răspuns brut backend:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error("Răspunsul de la server nu este JSON valid.");
  }

  if (data.success) {
    alert(data.message);
    window.location.href = 'login.html';
  } else {
    alert('Eroare: ' + data.message);
  }
} catch (error) {
  alert('Eroare la comunicarea cu serverul.');
  console.error(error);
}

  });
});
