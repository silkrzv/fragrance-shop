document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  const errorDiv = document.getElementById("login-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.textContent = "";

    const formData = {
      email: form.email.value.trim(),
      password: form.password.value,
    };

    try {
      const res = await fetch(
        "/fragrance_shop/api/controllers/login_process.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const text = await res.text();
      console.log("Răspuns brut backend:", text);

      const data = JSON.parse(text);

      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            first_name: data.first_name,
            last_name: data.last_name || "",
            role: data.role,
            email: data.email,
          })
        );
        window.location.href = "index.html";
      } else {
        errorDiv.textContent = data.message;
      }
    } catch (error) {
      errorDiv.textContent = "Eroare la comunicarea cu serverul.";
      console.error(error);
    }
  });
});
