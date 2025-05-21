document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const cartTotalElem = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const clearCartBtn = document.getElementById("clear-cart-btn");

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");

    if (Object.keys(cart).length === 0) {
      cartContainer.innerHTML = "<p>Coșul este gol.</p>";
      cartTotalElem.textContent = "0,00 lei";
      checkoutBtn.disabled = true;
      clearCartBtn.disabled = true;
      return;
    }

    fetch("/fragrance_shop/api/controllers/products.php")
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          cartContainer.innerHTML = "<p>Eroare la încărcarea produselor.</p>";
          return;
        }

        let total = 0;
        let html =
          '<table class="cart-table"><thead><tr><th>Produs</th><th>Preț</th><th>Cantitate</th><th>Subtotal</th><th>Acțiuni</th></tr></thead><tbody>';

        for (const [productId, qty] of Object.entries(cart)) {
          const product = data.products.find((p) => p.id == productId);
          if (!product) continue;

          const price = parseFloat(product.price);
          if (isNaN(price)) {
            console.error(
              `Preț invalid pentru produsul ${product.id}:`,
              product.price
            );
            continue;
          }

          const subtotal = price * qty;
          total += subtotal;

          html += `
          <tr data-id="${product.id}">
            <td>${product.name}</td>
            <td>${price.toFixed(2)} lei</td>
            <td>
              <input type="number" min="1" value="${qty}" class="qty-input" style="width: 60px;" />
            </td>
            <td>${subtotal.toFixed(2)} lei</td>
            <td><button class="remove-btn">Șterge</button></td>
          </tr>
        `;
        }

        html += "</tbody></table>";
        cartContainer.innerHTML = html;
        cartTotalElem.textContent = total.toFixed(2) + " lei";
        checkoutBtn.disabled = false;
        clearCartBtn.disabled = false;

        attachCartEvents();
      });
  }

  function attachCartEvents() {
    // Actualizare cantitate
    cartContainer.querySelectorAll(".qty-input").forEach((input) => {
      input.addEventListener("change", () => {
        const tr = input.closest("tr");
        const productId = tr.getAttribute("data-id");
        let newQty = parseInt(input.value);
        if (isNaN(newQty) || newQty < 1) newQty = 1;

        let cart = JSON.parse(localStorage.getItem("cart") || "{}");
        cart[productId] = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        document.dispatchEvent(new Event("cartUpdated"));
      });
    });

    cartContainer.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tr = btn.closest("tr");
        const productId = tr.getAttribute("data-id");
        let cart = JSON.parse(localStorage.getItem("cart") || "{}");
        delete cart[productId];
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        document.dispatchEvent(new Event("cartUpdated"));
      });
    });
  }

  clearCartBtn.addEventListener("click", () => {
    if (confirm("Ești sigur că vrei să golești coșul?")) {
      localStorage.removeItem("cart");
      renderCart();
      document.dispatchEvent(new Event("cartUpdated"));
    }
  });

  checkoutBtn.addEventListener("click", () => {
    alert("Funcționalitatea de finalizare comandă nu este implementată încă.");
  });

  document.addEventListener("cartUpdated", () => {
    renderCart();
  });

  renderCart();
});
