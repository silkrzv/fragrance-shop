document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");

  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/fragrance_shop/api/controllers/logout.php");
      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("user");
        window.location.href = "login.html";
      } else {
        alert("Eroare la delogare!");
      }
    } catch (error) {
      alert("Eroare la comunicarea cu serverul.");
      console.error(error);
    }
  });
});
