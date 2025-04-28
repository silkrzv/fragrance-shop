document.addEventListener("DOMContentLoaded", function () {
    const judetSelect = document.getElementById("judet");
    const orasSelect = document.getElementById("oras");

    fetch("/scripts/judete.json")
        .then(response => response.json())
        .then(data => {
            data.judete.forEach(judet => {
                const opt = document.createElement("option");
                opt.value = judet.nume;
                opt.textContent = judet.nume;
                judetSelect.appendChild(opt);
            });

            judetSelect.addEventListener("change", function () {
                const selectedJudet = this.value;
                orasSelect.innerHTML = '<option value="">Selectează orașul</option>';

                const judet = data.judete.find(j => j.nume === selectedJudet);
                if (judet) {
                    // Sortează localitățile în ordine alfabetică
                    judet.localitati.sort((a, b) => a.nume.localeCompare(b.nume));

                    judet.localitati.forEach(loc => {
                        const orasOpt = document.createElement("option");
                        orasOpt.value = loc.nume;
                        orasOpt.textContent = loc.nume;
                        orasSelect.appendChild(orasOpt);
                    });
                }
            });
        })
        .catch(error => {
            console.error("Eroare la încărcarea fișierului JSON:", error);
        });
});
