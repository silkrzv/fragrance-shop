document.addEventListener("DOMContentLoaded", () => {
  const countrySelect = document.getElementById("country-select");
  const phoneInput = document.getElementById("phone");

  fetch("/fragrance_shop/scripts/CountryCodes.json")
    .then(response => {
      console.log("Fetch CountryCodes.json status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Date încărcate CountryCodes.json:", data);
      data.forEach(country => {
        const option = document.createElement("option");
        option.value = country.dial_code;
        option.textContent = `${country.code} (${country.dial_code})`;
        countrySelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Eroare la încărcarea fișierului CountryCodes.json:", error);
    });

  countrySelect.addEventListener("change", function () {
    const dialCode = this.value;
    phoneInput.value = `(${dialCode}) `; 
    phoneInput.focus();
  });
});
