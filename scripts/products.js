document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products-container");

  // 1. Fetch produse din backend
  fetch("/fragrance_shop/api/controllers/products.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        productsContainer.innerHTML = "";
        data.products.forEach((product) => {
          productsContainer.innerHTML += renderModernProduct(product);
        });
        attachProductEvents();
      } else {
        productsContainer.innerHTML =
          '<p style="color:red; text-align:center;">Eroare la încărcarea produselor.</p>';
      }
    });

  // 2. Template modern pentru produs
  function renderModernProduct(product) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const isInWishlist = wishlist.includes(product.id.toString());

    return `
      <article class="parfum-item" data-id="${product.id}">
        <div class="parfum-header">
          <img class="parfum-img" src="../images/${product.image_url}" 
               alt="${product.name}" onclick="openProductPage(${product.id})">
          <h3 class="parfum-title">${product.name}</h3>
          <div class="parfum-brand">${product.brand}</div>
        </div>
        
        <div class="parfum-content">
          <div class="parfum-price">
            ${product.price} <span>lei</span>
          </div>
          
          <div class="parfum-notes-modern">
            <div class="note-item">
              <i class="note-icon base fas fa-layer-group"></i>
              <div class="note-title">Bază</div>
              <div class="note-value">${product.top_notes || "-"}</div>
            </div>
            <div class="note-item">
              <i class="note-icon middle fas fa-heart"></i>
              <div class="note-title">Mijloc</div>
              <div class="note-value">${product.middle_notes || "-"}</div>
            </div>
            <div class="note-item">
              <i class="note-icon top fas fa-wind"></i>
              <div class="note-title">Vârf</div>
              <div class="note-value">${product.base_notes || "-"}</div>
            </div>
          </div>
          
          <div class="parfum-meta">
            <div class="parfum-availability ${
              product.stock > 0 ? "in-stock" : "out-of-stock"
            }">
              <i class="fas fa-${
                product.stock > 0 ? "check-circle" : "exclamation-circle"
              }"></i>
              ${product.stock > 0 ? "În stoc" : "Stoc epuizat"}
            </div>
            <div class="parfum-type-badge">${product.gender}</div>
          </div>
          
          <div class="parfum-actions">
            <button class="btn-modern btn-primary btn-add" data-id="${
              product.id
            }" 
                    ${product.stock === 0 ? "disabled" : ""}>
              <i class="fas fa-cart-plus"></i> Adaugă în coș
            </button>
            <button class="btn-modern btn-secondary" onclick="openProductPage(${
              product.id
            })">
              <i class="fas fa-eye"></i> Detalii
            </button>
            <button class="btn-modern btn-wishlist ${
              isInWishlist ? "active" : ""
            }" 
                    data-id="${product.id}" title="Adaugă la favorite">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  // 3. Attach events
  function attachProductEvents() {
    // Add to cart
    document.querySelectorAll(".btn-add").forEach((btn) => {
      btn.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        addToCart(productId);
      });
    });

    // Wishlist toggle
    document.querySelectorAll(".btn-wishlist").forEach((btn) => {
      btn.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        toggleWishlist(productId, this);
      });
    });
  }

  // 4. Add to cart function
  function addToCart(productId) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Trebuie să fii logat pentru a adăuga produse în coș!");
      window.location.href = "login.html";
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart") || "{}");
    cart[productId] = (cart[productId] || 0) + 1;
    localStorage.setItem("cart", JSON.stringify(cart));

    // Show success message
    showNotification("Produsul a fost adăugat în coș!", "success");
    document.dispatchEvent(new Event("cartUpdated"));
  }

  // 5. Wishlist toggle function
  function toggleWishlist(productId, button) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Trebuie să fii logat pentru a adăuga la favorite!");
      window.location.href = "login.html";
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const index = wishlist.indexOf(productId);

    if (index > -1) {
      wishlist.splice(index, 1);
      button.classList.remove("active");
      showNotification("Produs eliminat din favorite!", "info");
    } else {
      wishlist.push(productId);
      button.classList.add("active");
      showNotification("Produs adăugat la favorite!", "success");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    // Dispatch event to update header wishlist count
    document.dispatchEvent(new Event("wishlistUpdated"));
  }

  // 6. Notification system
  function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "#22c55e" : "#3b82f6"};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-weight: 600;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
});

// 7. Function pentru deschiderea paginii de produs
function openProductPage(productId) {
  window.location.href = `product-details.html?id=${productId}`;
}

// 8. Sync wishlist with backend when user logs in
function syncWishlistWithBackend() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  fetch("/fragrance_shop/api/controllers/wishlist.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const backendWishlist = data.wishlist.map((item) =>
          item.product_id.toString()
        );
        localStorage.setItem("wishlist", JSON.stringify(backendWishlist));
      }
    });
}

// Call sync on page load
syncWishlistWithBackend();
