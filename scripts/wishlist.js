document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  loadWishlistProducts();
});

async function loadWishlistProducts() {
  const loadingDiv = document.getElementById("wishlist-loading");
  const emptyDiv = document.getElementById("wishlist-empty");
  const containerDiv = document.getElementById("wishlist-container");

  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

  if (wishlist.length === 0) {
    loadingDiv.style.display = "none";
    emptyDiv.style.display = "block";
    return;
  }

  try {
    // Fetch toate produsele
    const response = await fetch(
      "/fragrance_shop/api/controllers/products.php"
    );
    const data = await response.json();

    if (data.success) {
      const wishlistProducts = data.products.filter((product) =>
        wishlist.includes(product.id.toString())
      );

      loadingDiv.style.display = "none";

      if (wishlistProducts.length === 0) {
        emptyDiv.style.display = "block";
      } else {
        containerDiv.style.display = "grid";
        renderWishlistProducts(wishlistProducts);
      }
    }
  } catch (error) {
    console.error("Eroare la încărcarea produselor:", error);
    loadingDiv.innerHTML =
      '<p style="color: red;">Eroare la încărcarea produselor favorite.</p>';
  }
}

function renderWishlistProducts(products) {
  const container = document.getElementById("wishlist-container");

  container.innerHTML = products
    .map(
      (product) => `
    <article class="wishlist-item" data-id="${product.id}">
      <div class="wishlist-item-image">
        <img src="../images/${product.image_url}" alt="${product.name}" 
             onclick="openProductPage(${product.id})">
      </div>
      
      <div class="wishlist-item-content">
        <h3 class="wishlist-item-title" onclick="openProductPage(${
          product.id
        })">${product.name}</h3>
        <div class="wishlist-item-brand">${product.brand}</div>
        <div class="wishlist-item-price">${product.price} <span>lei</span></div>
        
        <div class="wishlist-item-availability ${
          product.stock > 0 ? "in-stock" : "out-of-stock"
        }">
          <i class="fas fa-${
            product.stock > 0 ? "check-circle" : "exclamation-circle"
          }"></i>
          ${product.stock > 0 ? "În stoc" : "Stoc epuizat"}
        </div>
        
        <div class="wishlist-item-actions">
          <button class="btn-modern btn-primary btn-add-cart" data-id="${
            product.id
          }" 
                  ${product.stock === 0 ? "disabled" : ""}>
            <i class="fas fa-cart-plus"></i> Adaugă în coș
          </button>
          <button class="btn-modern btn-secondary btn-remove-wishlist" data-id="${
            product.id
          }">
            <i class="fas fa-trash-alt"></i> Elimină
          </button>
        </div>
      </div>
    </article>
  `
    )
    .join("");

  attachWishlistEvents();
}

function attachWishlistEvents() {
  // Add to cart
  document.querySelectorAll(".btn-add-cart").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      addToCart(productId);
    });
  });

  // Remove from wishlist
  document.querySelectorAll(".btn-remove-wishlist").forEach((btn) => {
    btn.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      removeFromWishlist(productId);
    });
  });
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart") || "{}");
  cart[productId] = (cart[productId] || 0) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));

  showNotification("Produsul a fost adăugat în coș!", "success");
  document.dispatchEvent(new Event("cartUpdated"));
}

function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  const index = wishlist.indexOf(productId);

  if (index > -1) {
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    // Remove din UI
    const item = document.querySelector(`[data-id="${productId}"]`);
    if (item) {
      item.remove();
    }

    // Check dacă e gol
    if (wishlist.length === 0) {
      document.getElementById("wishlist-container").style.display = "none";
      document.getElementById("wishlist-empty").style.display = "block";
    }

    showNotification("Produs eliminat din favorite!", "info");
    document.dispatchEvent(new Event("wishlistUpdated"));
  }
}

function openProductPage(productId) {
  window.location.href = `product-details.html?id=${productId}`;
}

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${
      type === "success" ? "#22c55e" : type === "info" ? "#3b82f6" : "#ef4444"
    };
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
