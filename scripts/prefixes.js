document.addEventListener("DOMContentLoaded", () => {
    const countrySelect = document.getElementById("country-select");
    const phoneInput = document.getElementById("phone");

    // Load countries
    fetch("/scripts/CountryCodes.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(country => {
                const option = document.createElement("option");
                option.value = country.dial_code;
                option.textContent = `${country.code} (${country.dial_code})`;
                countrySelect.appendChild(option);
            });
        });

    // Update phone input when a country is selected
    countrySelect.addEventListener("change", function () {
        const dialCode = this.value;
        phoneInput.value = `(${dialCode}) `; // Setează prefixul selectat
        phoneInput.focus(); // Mută focusul pe câmpul de telefon
    });
});
