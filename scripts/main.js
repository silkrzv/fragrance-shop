document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const loginLink = document.getElementById("login-link");
  const userMenu = document.getElementById("user-menu");
  const wishlistHeader = document.getElementById("header-wishlist");

  if (user) {
    if (loginLink) loginLink.style.display = "none";
    if (userMenu) userMenu.style.display = "flex";
    if (wishlistHeader) {
      wishlistHeader.style.display = "flex";
      updateWishlistHeader();
    }
  } else {
    if (loginLink) loginLink.style.display = "flex";
    if (userMenu) userMenu.style.display = "none";
    if (wishlistHeader) wishlistHeader.style.display = "none";
  }

  // Dropdown user menu toggle (hover și click)
  const userBtn = document.getElementById("user-btn");
  if (userBtn && userMenu) {
    // Pe click
    userBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      userMenu.classList.toggle("open");
    });
    // Pe hover (desktop)
    userBtn.addEventListener("mouseenter", () => {
      userMenu.classList.add("open");
    });
    userMenu.addEventListener("mouseleave", () => {
      userMenu.classList.remove("open");
    });
    // Închide la click în afara
    document.addEventListener("click", () => {
      userMenu.classList.remove("open");
    });
    userMenu.addEventListener("click", (e) => e.stopPropagation());
  }

  // Listen for wishlist updates to refresh header count
  document.addEventListener("wishlistUpdated", updateWishlistHeader);
});

/**
 * Updates the wishlist icon count in the header.
 */
function updateWishlistHeader() {
  const wishlistHeader = document.getElementById("header-wishlist");
  if (!wishlistHeader) return;

  const wishlistCountSpan = wishlistHeader.querySelector(".wishlist-count");
  if (!wishlistCountSpan) return;

  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const count = wishlist.length;

  wishlistCountSpan.textContent =
    count === 1 ? "1 Favorit" : `${count} Favorite`;

  // Manage badge element showing count number
  let badge = wishlistHeader.querySelector(".wishlist-badge");
  if (count > 0) {
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "wishlist-badge";
      wishlistHeader.appendChild(badge);
    }
    badge.textContent = count;
  } else if (badge) {
    badge.remove();
  }
}

// Function to update wishlist count in header
function updateWishlistHeader() {
  const wishlistHeader = document.getElementById("header-wishlist");
  const wishlistCountSpan = wishlistHeader?.querySelector(".wishlist-count");
  if (!wishlistHeader || !wishlistCountSpan) return;

  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const count = wishlist.length;

  wishlistCountSpan.textContent =
    count === 1 ? "1 Favorit" : `${count} Favorite`;

  const badge = wishlistHeader.querySelector(".wishlist-badge");
  if (badge) {
    badge.remove();
  }
}

// functionalitate de actualizare a coșului

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  document.querySelectorAll(".btn-add").forEach((btn) => {
    btn.disabled = !user;
  });

  updateCartUI();

  // Functie care actualizeaza suma si numarul produselor in header
  function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    const cartCountElem = document.querySelector(".cart-count");
    const cartAmountElem = document.querySelector(".cart-amount");

    if (!cartCountElem || !cartAmountElem) return;

    fetch("/fragrance_shop/api/controllers/products.php")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) return;

        let totalCount = 0;
        let totalAmount = 0;

        for (const [productId, qty] of Object.entries(cart)) {
          const product = data.products.find((p) => p.id == productId);
          if (product) {
            totalCount += qty;
            totalAmount += product.price * qty;
          }
        }

        cartCountElem.textContent = `${totalCount} ${
          totalCount === 1 ? "Produs" : "Produse"
        }`;
        cartAmountElem.textContent = totalAmount.toFixed(2) + " lei";
      });
  }

  document.addEventListener("cartUpdated", updateCartUI);
});

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

  // functionalitate adaugare recenzie
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

// functionalitatea cu readmore

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

  showItem(currentIndex);
  startAutoAdvance();
});

// Hamburger menu toggle
const menuToggle = document.getElementById("menu-toggle");
const mainMenu = document.getElementById("main-menu");

menuToggle.addEventListener("click", () => {
  mainMenu.classList.toggle("active");
});

// Submenu open/close pe mobil
const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    if (window.innerWidth <= 768) {
      const submenu = this.querySelector(".submenu");
      if (submenu) {
        e.preventDefault();
        this.classList.toggle("active");
      }
    }
  });
});

// functie de actualizare a anului din footer
function updateFooterYear() {
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", updateFooterYear);

// implementare cerinta #1 jQuery
$(function () {
  if (!$) {
    console.error("jQuery nu este încărcat corect");
    return;
  }

  const $slider = $("#custom-slider");
  if (!$slider.length) {
    console.error("Elementul #custom-slider nu a fost găsit");
    return;
  }

  const $itemsContainer = $slider.find(".slider-items");
  const $items = $itemsContainer.children(".slider-item");
  const itemCount = $items.length;

  if (!$itemsContainer.length || !$items.length) {
    console.error("Containerul sau elementele slider-ului nu au fost găsite");
    return;
  }

  console.log("Slider inițializat cu " + itemCount + " elemente");

  let currentIndex = 0;
  let visibleCount = parseInt($("#slider-count").val(), 10) || 1;
  let intervalSec = parseInt($("#slider-interval").val(), 10) || 3;
  let autoSlide = null;
  let isDragging = false;
  let startX, moveX;

  // Creeaza indicatoarele pentru slide-uri
  const $dotsContainer = $slider.find(".slider-dots");
  $dotsContainer.empty();

  for (let i = 0; i < itemCount; i++) {
    $dotsContainer.append(`<div class="slider-dot" data-index="${i}"></div>`);
  }

  const $dots = $dotsContainer.find(".slider-dot");
  $dots.first().addClass("active");

  // Functie pentru actualizarea slide-ului activ
  function goToSlide(index) {
    currentIndex = index;
    console.log("Navigare la slide-ul: " + currentIndex);

    // Folosim translateX pentru tranzitie
    $itemsContainer.css({
      transform: `translateX(-${currentIndex * 100}%)`,
      transition: "transform 0.8s ease",
    });

    $dots.removeClass("active").eq(currentIndex).addClass("active");
  }

  // Slide urmator
  function nextSlide() {
    let nextIndex = (currentIndex + 1) % itemCount;
    goToSlide(nextIndex);
  }

  // Slide anterior
  function prevSlide() {
    let prevIndex = (currentIndex - 1 + itemCount) % itemCount;
    goToSlide(prevIndex);
  }

  // Reseteaza interval auto-slide
  function resetInterval() {
    if (autoSlide) clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, intervalSec * 1000);
  }

  // Event listeners pentru controlul slide-urilor
  $slider.find(".slider-arrow-right").on("click", function (e) {
    e.preventDefault();
    console.log("Buton dreapta apăsat");
    nextSlide();
    resetInterval();
  });

  $slider.find(".slider-arrow-left").on("click", function (e) {
    e.preventDefault();
    console.log("Buton stânga apăsat");
    prevSlide();
    resetInterval();
  });

  // Event listeners pentru dots
  $dots.on("click", function () {
    const index = $(this).data("index");
    console.log("Dot apăsat: " + index);
    goToSlide(index);
    resetInterval();
  });

  // Functionalitate de swipe pe mobil
  $itemsContainer.on("touchstart mousedown", function (e) {
    isDragging = true;
    startX =
      e.type === "touchstart" ? e.originalEvent.touches[0].clientX : e.clientX;
    $itemsContainer.css("transition", "none");
    e.preventDefault();
  });

  $itemsContainer.on("touchmove mousemove", function (e) {
    if (!isDragging) return;
    moveX =
      e.type === "touchmove" ? e.originalEvent.touches[0].clientX : e.clientX;
    const diff = moveX - startX;
    const offset = (diff / $slider.width()) * 100;
    $itemsContainer.css(
      "transform",
      `translateX(calc(-${currentIndex * 100}% + ${offset}px))`
    );
  });

  $itemsContainer.on("touchend mouseup mouseleave", function () {
    if (!isDragging) return;
    isDragging = false;
    $itemsContainer.css("transition", "transform 0.8s ease");

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

  $("#slider-count").on("input change", function () {
    visibleCount = Math.max(
      1,
      Math.min(itemCount, parseInt(this.value, 10) || 1)
    );
    console.log("Vizibile: " + visibleCount);
    resetInterval();
  });

  $("#slider-interval").on("input change", function () {
    intervalSec = Math.max(1, parseInt(this.value, 10) || 3);
    console.log("Interval: " + intervalSec + "s");
    resetInterval();
  });

  function handleVideoAutoplay() {
    const $videos = $items.find("video");
    $videos.each(function () {
      $(this)[0].pause();
    });

    const $currentVideo = $items.eq(currentIndex).find("video");
    if ($currentVideo.length) {
      $currentVideo[0].currentTime = 0;
      const playPromise = $currentVideo[0].play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Eroare autoplay: " + error);
        });
      }
    }
  }

  $items.find("video").on("ended", function () {
    nextSlide();
    resetInterval();
  });

  $itemsContainer.on("transitionend", handleVideoAutoplay);

  goToSlide(0);
  resetInterval();
  handleVideoAutoplay();

  console.log("Slider inițializat complet!");
});

// functionalitatea 2 jQuery
$(function () {
  $(".product-tabs-section").each(function () {
    const $section = $(this);

    $section.addClass("tab-container");

    $section.find(".tab-btn").on("click", function (e) {
      e.preventDefault();

      $section.find(".tab-btn").removeClass("active");

      $(this).addClass("active");

      const tabId = $(this).data("tab");
      console.log("Tab ID: " + tabId);

      $section.find(".tab-content").removeClass("active");

      $section.find("#" + tabId).addClass("active");
      console.log("Found tab content: " + $section.find("#" + tabId).length);
    });
  });
});

// functionalitate 3 jQuery - pop-up imagine
$(function () {
  $("#popup-overlay").hide();

  function showInPopup($element) {
    $("#popup-inner").find("img, video").remove();

    let $clone;

    if ($element.is("video")) {
      $clone = $element
        .clone()
        .removeAttr("width height controls muted autoplay");
      $clone.attr({
        controls: true,
        autoplay: true,
      });
    } else {
      $clone = $element.clone().removeAttr("width height");
    }

    $("#popup-inner").append($clone);
    $("#popup-overlay").fadeIn(200);
  }

  $("body").on("click", ".parfum-img", function () {
    showInPopup($(this));
  });

  $("body").on(
    "click",
    "#custom-slider .slider-item img, #custom-slider .slider-item video",
    function (e) {
      e.preventDefault();
      showInPopup($(this));
    }
  );

  $("#popup-close, #popup-overlay").on("click", function (e) {
    if (e.target.id === "popup-overlay" || e.target.id === "popup-close") {
      $("#popup-overlay").fadeOut(200, function () {
        $("#popup-inner").find("img, video").remove();
      });
    }
  });

  $("#popup-inner").on("click", function (e) {
    e.stopPropagation();
  });
});
