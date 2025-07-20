document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Populeaza datele din profil
  document.getElementById("profile-name").textContent =
    (user.first_name || "") + (user.last_name ? " " + user.last_name : "") ||
    "Utilizator";

  document.getElementById("profile-role").textContent =
    user.role && user.role.toLowerCase() === "admin" ? "ADMIN" : "USER";

  document.getElementById("profile-email").textContent = user.email || "-";

  // Exemplu: data inregistrare (salvata în user.joined sau alt field)
  document.getElementById("profile-joined").textContent =
    "Membru din: " +
    (user.joined ? new Date(user.joined).toLocaleDateString("ro-RO") : "-");

  // Exemplu: favorite si comenzi (daca ai aceste date in localStorage sau user)
  const favorites = JSON.parse(localStorage.getItem("wishlist") || "[]");
  document.getElementById(
    "profile-favorites"
  ).textContent = `Favorite: ${favorites.length} produse`;

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  document.getElementById(
    "profile-orders"
  ).textContent = `Comenzi plasate: ${orders.length}`;

  // Logout rapid din profil
  const logoutBtn = document.getElementById("logout-btn-profile");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  }
});
