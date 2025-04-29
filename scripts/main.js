// selectăm elementele necesare
const playPauseBtn = document.getElementById('playPauseBtn');
const repeatCheckbox = document.getElementById('repeatCheckbox');
const intervalSelect = document.getElementById('intervalSelect');
const radioButtons = document.querySelectorAll('input[name="slider"]');
let intervalID;
let currentIndex = 0;
let isPlaying = false;
let intervalTime = parseInt(intervalSelect.value, 10);

// funcția care schimbă imaginea
function changeImage() {
    currentIndex = (currentIndex + 1) % radioButtons.length;
    radioButtons[currentIndex].checked = true;
}

// pornim sau oprim slider-ul
function togglePlayPause() {
    if (isPlaying) {
        clearInterval(intervalID);
        playPauseBtn.textContent = 'Play';
    } else {
        intervalID = setInterval(changeImage, intervalTime);
        playPauseBtn.textContent = 'Pauză';
    }
    isPlaying = !isPlaying;
}

// activăm sau dezactivăm repetarea
function toggleRepeat() {
    if (repeatCheckbox.checked) {
        // dacă checkbox-ul este bifat, atunci să revenim la prima imagine după ultima
        radioButtons[radioButtons.length - 1].addEventListener('change', () => {
            if (isPlaying) {
                currentIndex = 0;
                radioButtons[currentIndex].checked = true;
            }
        });
    }
}

// schimbăm intervalul de timp
function changeInterval() {
    intervalTime = parseInt(intervalSelect.value, 10);
    if (isPlaying) {
        clearInterval(intervalID);
        intervalID = setInterval(changeImage, intervalTime);
    }
}

// evenimente pentru controlul slider-ului
playPauseBtn.addEventListener('click', togglePlayPause);
repeatCheckbox.addEventListener('change', toggleRepeat);
intervalSelect.addEventListener('change', changeInterval);




// sortare tabel recenzii
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("table.sortable").forEach((table) => {
        const headers = table.querySelectorAll("thead th");
        let sortDirections = Array(headers.length).fill(true); // true = asc, false = desc

        headers.forEach((header, index) => {
            header.addEventListener("click", () => {
                const tbody = table.querySelector("tbody");
                const rows = Array.from(tbody.querySelectorAll("tr"));
                const asc = sortDirections[index];

                rows.sort((a, b) => {
                    const cellA = a.children[index].textContent.trim();
                    const cellB = b.children[index].textContent.trim();

                    const aNum = parseFloat(cellA);
                    const bNum = parseFloat(cellB);
                    const isNumeric = !isNaN(aNum) && !isNaN(bNum);

                    if (isNumeric) {
                        return asc ? aNum - bNum : bNum - aNum;
                    } else {
                        return asc
                            ? cellA.localeCompare(cellB)
                            : cellB.localeCompare(cellA);
                    }
                });

                rows.forEach((row) => tbody.appendChild(row));

                headers.forEach((h) => h.classList.remove("sort-asc", "sort-desc"));
                header.classList.add(asc ? "sort-asc" : "sort-desc");

                sortDirections[index] = !asc;
            });
        });
    });

    // funcționalitate adăugare recenzie
    const reviewForm = document.getElementById("reviewForm");
    const reviewsTableBody = document.getElementById("reviewsTableBody");

    reviewForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("nameInput").value.trim();
        const perfume = document.getElementById("perfumeInput").value.trim();
        const review = document.getElementById("reviewInput").value.trim();
        const stars = document.getElementById("starsInput").value;

        if (!name || !perfume || !review || !stars) return;

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${name}</td>
            <td>${perfume}</td>
            <td>${review}</td>
            <td>${stars}</td>
        `;

        reviewsTableBody.appendChild(newRow);
        reviewForm.reset();
    });
});


// cerinta cu readmore

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".list-item");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    let currentIndex = 0;
    let interval = 3000; // 3 secunde default
    let autoAdvance;

    function showItem(index) {
        items.forEach((item, i) => {
            item.classList.remove("visible");
            if (i === index) {
                item.classList.add("visible");
            }
        });
    }

    function nextItem() {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
    }

    function prevItem() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(currentIndex);
    }

    nextBtn.addEventListener("click", () => {
        clearInterval(autoAdvance);
        nextItem();
        startAutoAdvance();
    });

    prevBtn.addEventListener("click", () => {
        clearInterval(autoAdvance);
        prevItem();
        startAutoAdvance();
    });

    function startAutoAdvance() {
        autoAdvance = setInterval(() => {
            nextItem();
        }, interval);
    }

    // Inițializare
    showItem(currentIndex);
    startAutoAdvance();
});


// Hamburger menu toggle
const menuToggle = document.getElementById('menu-toggle');
const mainMenu = document.getElementById('main-menu');

menuToggle.addEventListener('click', () => {
  mainMenu.classList.toggle('active');
});

// Submenu open/close pe mobil
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
  item.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      const submenu = this.querySelector('.submenu');
      if (submenu) {
        e.preventDefault(); // Previne navigarea directă la link
        this.classList.toggle('active');
      }
    }
  });
});

// functie de actualizare a anului din footer
function updateFooterYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Apelează funcția când pagina este încărcată
document.addEventListener('DOMContentLoaded', updateFooterYear);



