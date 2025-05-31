document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  const loadingDiv = document.getElementById("product-loading");
  const detailsDiv = document.getElementById("product-details");
  const errorDiv = document.getElementById("product-error");

  if (!productId) {
    showError();
    return;
  }

  // Încarcă detaliile produsului
  fetch(`/fragrance_shop/api/controllers/product-details.php?id=${productId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        renderProductDetails(data.product);
      } else {
        showError();
      }
    })
    .catch(() => showError());

  function renderProductDetails(product) {
    loadingDiv.style.display = "none";
    detailsDiv.style.display = "block";

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const isInWishlist = wishlist.includes(product.id.toString());

    detailsDiv.innerHTML = `
      <div class="product-details-grid">
        <div class="product-image-section">
          <div class="product-main-image">
            <img src="../images/${product.image_url}" alt="${
      product.name
    }" id="main-product-image">
          </div>
        </div>
        
        <div class="product-info-section">
          <div class="product-breadcrumb">
            <a href="products.html"><i class="fas fa-arrow-left"></i> Înapoi la produse</a>
          </div>
          
          <h1 class="product-title">${product.name}</h1>
          <div class="product-brand">${product.brand}</div>
          
          <div class="product-price-section">
            <div class="product-price">${product.price} <span>lei</span></div>
            <div class="product-availability ${
              product.stock > 0 ? "in-stock" : "out-of-stock"
            }">
              <i class="fas fa-${
                product.stock > 0 ? "check-circle" : "exclamation-circle"
              }"></i>
              ${
                product.stock > 0
                  ? `În stoc (${product.stock} bucăți)`
                  : "Stoc epuizat"
              }
            </div>
          </div>
          
          <div class="product-notes-section">
            <h3><i class="fas fa-leaf"></i> Ingrediente și Note</h3>
            <div class="notes-grid">
              <div class="note-detail">
                <div class="note-label">
                  <i class="fas fa-layer-group"></i> Note de bază
                </div>
                <div class="note-content">${
                  product.base_notes || "Nu sunt specificate"
                }</div>
              </div>
              <div class="note-detail">
                <div class="note-label">
                  <i class="fas fa-heart"></i> Note de mijloc
                </div>
                <div class="note-content">${
                  product.middle_notes || "Nu sunt specificate"
                }</div>
              </div>
              <div class="note-detail">
                <div class="note-label">
                  <i class="fas fa-wind"></i> Note de vârf
                </div>
                <div class="note-content">${
                  product.top_notes || "Nu sunt specificate"
                }</div>
              </div>
            </div>
          </div>
          
          <div class="product-meta">
            <div class="meta-item">
              <span class="meta-label"><i class="fas fa-venus-mars"></i> Tip:</span>
              <span class="meta-value">${product.gender}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label"><i class="fas fa-tag"></i> Brand:</span>
              <span class="meta-value">${product.brand}</span>
            </div>
          </div>
          
          <div class="product-actions">
            <div class="quantity-selector">
              <label for="quantity">Cantitate:</label>
              <div class="quantity-controls">
                <button type="button" onclick="changeQuantity(-1)">-</button>
                <input type="number" id="quantity" value="1" min="1" max="${
                  product.stock
                }" />
                <button type="button" onclick="changeQuantity(1)">+</button>
              </div>
            </div>
            
            <div class="action-buttons">
              <button class="btn-modern btn-primary btn-add-cart" data-id="${
                product.id
              }" 
                      ${product.stock === 0 ? "disabled" : ""}>
                <i class="fas fa-cart-plus"></i> Adaugă în coș
              </button>
              <button class="btn-modern btn-wishlist ${
                isInWishlist ? "active" : ""
              }" 
                      data-id="${product.id}">
                <i class="fas fa-heart"></i> ${
                  isInWishlist ? "În favorite" : "Adaugă la favorite"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="product-description-section">
        <h3><i class="fas fa-info-circle"></i> Descriere</h3>
        <p>${
          product.description ||
          "Nu există descriere disponibilă pentru acest produs."
        }</p>
      </div>
    `;

    attachDetailEvents(product);
  }

  function attachDetailEvents(product) {
    // Add to cart
    const addCartBtn = document.querySelector(".btn-add-cart");
    if (addCartBtn) {
      addCartBtn.addEventListener("click", () => {
        const quantity = parseInt(document.getElementById("quantity").value);
        addToCart(product.id, quantity);
      });
    }

    // Wishlist toggle
    const wishlistBtn = document.querySelector(".btn-wishlist");
    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", () => {
        toggleWishlist(product.id, wishlistBtn);
      });
    }
  }

  function addToCart(productId, quantity = 1) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Trebuie să fii logat pentru a adăuga produse în coș!");
      window.location.href = "login.html";
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart") || "{}");
    cart[productId] = (cart[productId] || 0) + quantity;
    localStorage.setItem("cart", JSON.stringify(cart));

    showNotification(`${quantity} produs(e) adăugat(e) în coș!`, "success");
    document.dispatchEvent(new Event("cartUpdated"));
  }

  function toggleWishlist(productId, button) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Trebuie să fii logat pentru a adăuga la favorite!");
      window.location.href = "login.html";
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const index = wishlist.indexOf(productId.toString());

    if (index > -1) {
      wishlist.splice(index, 1);
      button.classList.remove("active");
      button.innerHTML = '<i class="fas fa-heart"></i> Adaugă la favorite';
      showNotification("Produs eliminat din favorite!", "info");
    } else {
      wishlist.push(productId.toString());
      button.classList.add("active");
      button.innerHTML = '<i class="fas fa-heart"></i> În favorite';
      showNotification("Produs adăugat la favorite!", "success");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }

  function showError() {
    loadingDiv.style.display = "none";
    errorDiv.style.display = "block";
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
});

// Quantity controls
function changeQuantity(change) {
  const quantityInput = document.getElementById("quantity");
  const currentValue = parseInt(quantityInput.value);
  const newValue = currentValue + change;

  if (newValue >= 1 && newValue <= parseInt(quantityInput.max)) {
    quantityInput.value = newValue;
  }
}
