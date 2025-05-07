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



// implementare cerinta #1 jQuery
$(function() {
    // Verifică dacă jQuery este încărcat corect
    if (!$) {
      console.error("jQuery nu este încărcat corect");
      return;
    }
  
    // Verifică dacă elementele există în DOM
    const $slider = $('#custom-slider');
    if (!$slider.length) {
      console.error("Elementul #custom-slider nu a fost găsit");
      return;
    }
    
    const $itemsContainer = $slider.find('.slider-items');
    const $items = $itemsContainer.children('.slider-item');
    const itemCount = $items.length;
    
    if (!$itemsContainer.length || !$items.length) {
      console.error("Containerul sau elementele slider-ului nu au fost găsite");
      return;
    }
    
    console.log("Slider inițializat cu " + itemCount + " elemente");
    
    let currentIndex = 0;
    let visibleCount = parseInt($('#slider-count').val(), 10) || 1;
    let intervalSec = parseInt($('#slider-interval').val(), 10) || 3;
    let autoSlide = null;
    let isDragging = false;
    let startX, moveX;
  
    // Creează indicatoarele pentru slide-uri
    const $dotsContainer = $slider.find('.slider-dots');
    $dotsContainer.empty(); // Curăță indicatoarele existente
    
    for (let i = 0; i < itemCount; i++) {
      $dotsContainer.append(`<div class="slider-dot" data-index="${i}"></div>`);
    }
    
    const $dots = $dotsContainer.find('.slider-dot');
    $dots.first().addClass('active');
  
    // Funcție pentru actualizarea slide-ului activ
    function goToSlide(index) {
      currentIndex = index;
      console.log("Navigare la slide-ul: " + currentIndex);
      
      // Folosim translateX pentru tranziție
      $itemsContainer.css({
        'transform': `translateX(-${currentIndex * 100}%)`,
        'transition': 'transform 0.8s ease'
      });
      
      $dots.removeClass('active').eq(currentIndex).addClass('active');
    }
  
    // Slide următor
    function nextSlide() {
      let nextIndex = (currentIndex + 1) % itemCount;
      goToSlide(nextIndex);
    }
  
    // Slide anterior
    function prevSlide() {
      let prevIndex = (currentIndex - 1 + itemCount) % itemCount;
      goToSlide(prevIndex);
    }
  
    // Resetează interval auto-slide
    function resetInterval() {
      if (autoSlide) clearInterval(autoSlide);
      autoSlide = setInterval(nextSlide, intervalSec * 1000);
    }
  
    // Event listeners pentru controlul slide-urilor
    $slider.find('.slider-arrow-right').on('click', function(e) {
      e.preventDefault();
      console.log("Buton dreapta apăsat");
      nextSlide();
      resetInterval();
    });
  
    $slider.find('.slider-arrow-left').on('click', function(e) {
      e.preventDefault();
      console.log("Buton stânga apăsat");
      prevSlide();
      resetInterval();
    });
  
    // Event listeners pentru dots
    $dots.on('click', function() {
      const index = $(this).data('index');
      console.log("Dot apăsat: " + index);
      goToSlide(index);
      resetInterval();
    });
  
    // Funcționalitate de swipe pe mobil
    $itemsContainer.on('touchstart mousedown', function(e) {
      isDragging = true;
      startX = e.type === 'touchstart' ? e.originalEvent.touches[0].clientX : e.clientX;
      $itemsContainer.css('transition', 'none');
      e.preventDefault();
    });
  
    $itemsContainer.on('touchmove mousemove', function(e) {
      if (!isDragging) return;
      moveX = e.type === 'touchmove' ? e.originalEvent.touches[0].clientX : e.clientX;
      const diff = moveX - startX;
      const offset = (diff / $slider.width()) * 100;
      $itemsContainer.css('transform', `translateX(calc(-${currentIndex * 100}% + ${offset}px))`);
    });
  
    $itemsContainer.on('touchend mouseup mouseleave', function() {
      if (!isDragging) return;
      isDragging = false;
      $itemsContainer.css('transition', 'transform 0.8s ease');
      
      if (moveX && Math.abs(moveX - startX) > 50) { 
        if (moveX - startX > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      } else {
        goToSlide(currentIndex);
      }
      moveX = null;
      resetInterval();
    });
  
    $('#slider-count').on('input change', function() {
      visibleCount = Math.max(1, Math.min(itemCount, parseInt(this.value, 10) || 1));
      console.log("Vizibile: " + visibleCount);
      resetInterval();
    });
  
    $('#slider-interval').on('input change', function() {
      intervalSec = Math.max(1, parseInt(this.value, 10) || 3);
      console.log("Interval: " + intervalSec + "s");
      resetInterval();
    });
  
    function handleVideoAutoplay() {
      const $videos = $items.find('video');
      $videos.each(function() {
        $(this)[0].pause();
      });
      
      const $currentVideo = $items.eq(currentIndex).find('video');
      if ($currentVideo.length) {
        $currentVideo[0].currentTime = 0;
        const playPromise = $currentVideo[0].play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Eroare autoplay: " + error);
          });
        }
      }
    }
  
    $items.find('video').on('ended', function() {
      nextSlide();
      resetInterval();
    });
  
    $itemsContainer.on('transitionend', handleVideoAutoplay);
  
    goToSlide(0);
    resetInterval();
    handleVideoAutoplay();
    
    console.log("Slider inițializat complet!");
  });
  


// functionalitatea 2 jQuery
  $(function() {
    $('.product-tabs-section').each(function() {
      const $section = $(this);
      
      $section.addClass('tab-container');
      
      $section.find('.tab-btn').on('click', function(e) {
        e.preventDefault();

        $section.find('.tab-btn').removeClass('active');
      
        $(this).addClass('active');
        
        const tabId = $(this).data('tab');
        console.log("Tab ID: " + tabId); 
        
        $section.find('.tab-content').removeClass('active');
        
        $section.find('#' + tabId).addClass('active');
        console.log("Found tab content: " + $section.find('#' + tabId).length); 
      });
    });
  });



// functionalitate 3 jQuery - pop-up imagine
$(function() {
  // Ascunde popup-ul la început
  $('#popup-overlay').hide();

  // Funcție comună pentru afișarea unui element (imagine sau video) în popup
  function showInPopup($element) {
    // Curăță conținutul anterior
    $('#popup-inner').find('img, video').remove();

    let $clone;

    if ($element.is('video')) {
      $clone = $element.clone().removeAttr('width height controls muted autoplay');
      $clone.attr({
        controls: true,
        autoplay: true
      });
    } else {
      $clone = $element.clone().removeAttr('width height');
    }

    $('#popup-inner').append($clone);
    $('#popup-overlay').fadeIn(200);
  }

  // Click pe .parfum-img (funcționalitatea veche)
  $('body').on('click', '.parfum-img', function() {
    showInPopup($(this));
  });

  // Click pe img sau video din slider (funcționalitatea nouă)
  $('body').on('click', '#custom-slider .slider-item img, #custom-slider .slider-item video', function(e) {
    e.preventDefault(); // prevenim comportamentul implicit (ex: autoplay blocat)
    showInPopup($(this));
  });

  // Închide popup-ul la click pe fundal sau pe X
  $('#popup-close, #popup-overlay').on('click', function(e) {
    if (e.target.id === 'popup-overlay' || e.target.id === 'popup-close') {
      $('#popup-overlay').fadeOut(200, function() {
        $('#popup-inner').find('img, video').remove();
      });
    }
  });

  // Previne închiderea când se face click pe conținutul popup-ului
  $('#popup-inner').on('click', function(e) {
    e.stopPropagation();
  });
});



  
  
  
  

