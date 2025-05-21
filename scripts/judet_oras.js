document.addEventListener("DOMContentLoaded", () => {
  const judetSelect = document.getElementById("judet");
  const orasSelect = document.getElementById("oras");

  fetch("/fragrance_shop/scripts/judete.json")
    .then((response) => {
      console.log("Fetch judete.json status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      try {
        const data = JSON.parse(text);
        console.log("Date încărcate judete.json:", data);

        data.judete.forEach((judet) => {
          const opt = document.createElement("option");
          opt.value = judet.nume;
          opt.textContent = judet.nume;
          judetSelect.appendChild(opt);
        });

        judetSelect.addEventListener("change", function () {
          const selectedJudet = this.value;
          orasSelect.innerHTML = '<option value="">Selectează orașul</option>';

          const judet = data.judete.find((j) => j.nume === selectedJudet);
          if (judet) {
            judet.localitati.sort((a, b) => a.nume.localeCompare(b.nume));
            judet.localitati.forEach((loc) => {
              const orasOpt = document.createElement("option");
              orasOpt.value = loc.nume;
              orasOpt.textContent = loc.nume;
              orasSelect.appendChild(orasOpt);
            });
          }
        });
      } catch (parseError) {
        console.error("Eroare la parsarea JSON-ului:", parseError);
        console.log("Conținut primit:", text);
      }
    })
    .catch((error) => {
      console.error("Eroare la încărcarea fișierului judete.json:", error);
    });
});
