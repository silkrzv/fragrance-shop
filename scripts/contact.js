document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("contact-feedback");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    feedback.textContent = "";
    feedback.style.color = "#4955a5";

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      feedback.textContent = "Completează toate câmpurile obligatorii!";
      feedback.style.color = "#d7263d";
      return;
    }

    try {
      const res = await fetch(
        "/fragrance_shop/api/controllers/contact_process.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, message }),
        }
      );

      const data = await res.json();

      if (data.success) {
        feedback.textContent =
          "Mesajul a fost trimis cu succes! Vă vom contacta în cel mai scurt timp.";
        feedback.style.color = "#38ada9";

        form.reset();

        const textarea = form.querySelector("textarea#message");
        if (textarea) {
          textarea.style.height = "140px";
        }
      } else {
        feedback.textContent =
          data.message || "A apărut o eroare. Încearcă din nou.";
        feedback.style.color = "#d7263d";
      }
    } catch (err) {
      feedback.textContent =
        "Eroare la trimiterea mesajului. Încearcă mai târziu.";
      feedback.style.color = "#d7263d";
      console.error(err);
    }
  });
});
