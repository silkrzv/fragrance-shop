document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products-container');

  // 1. Fetch produse din backend
  fetch('/fragrance_shop/api/controllers/products.php')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        productsContainer.innerHTML = '';
        data.products.forEach(product => {
          productsContainer.innerHTML += renderProduct(product);
        });
        attachAddToCartEvents();
      } else {
        productsContainer.innerHTML = '<p style="color:red">Eroare la încărcarea produselor.</p>';
      }
    });

  // 2. Template pentru un produs
  function renderProduct(product) {
    return `
      <article class="parfum-item" data-id="${product.id}">
        <h3 class="parfum-title">${product.name}</h3>
        <div class="parfum-img-container">
          <img class="parfum-img" src="../images/${product.image_url}" alt="${product.name}">
        </div>
        <div class="parfum-info">
          <table class="parfum-table">
            <thead>
              <tr>
                <th><i class="fa-solid fa-tag"></i> Brand</th>
                <th><i class="fa-solid fa-coins"></i> Preț</th>
                <th><i class="fa-solid fa-leaf"></i> Ingrediente</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${product.brand}</td>
                <td>${product.price} lei</td>
                <td>
                  <table class="notes-table">
                    <thead>
                      <tr>
                        <th><i class="fa-solid fa-layer-group"></i> Note de bază</th>
                        <th><i class="fa-solid fa-heart"></i> Note de mijloc</th>
                        <th><i class="fa-solid fa-wind"></i> Note de vârf</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>${product.notes_base || '-'}</td>
                        <td>${product.notes_middle || '-'}</td>
                        <td>${product.notes_top || '-'}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="parfum-availability-inline" style="margin-top: 12px; font-weight: 600; font-size: 1rem;">
          <i class="fa-solid fa-check-circle" style="color: green; margin-right: 6px;"></i>
          ${product.stock > 0 ? 'În stoc' : 'Stoc epuizat'}
        </div>
        <p class="parfum-type"><strong><i class="fa-solid fa-mars"></i> Tip:</strong> ${product.type}</p>
        <button class="btn btn-add" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
          <i class="fa-solid fa-cart-plus"></i> Adaugă în coș
        </button>
      </article>
    `;
  }

  // 3. Event pentru adăugare în coș cu AJAX (localStorage)
  function attachAddToCartEvents() {
    document.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        addToCart(productId);
      });
    });
  }

  // 4. Funcție pentru adăugare în coș (localStorage)
  function addToCart(productId) {
  const user = JSON.parse(localStorage.getItem('user'));

  // Verifică dacă userul este logat
  if (!user) {
    alert('Trebuie să fii logat pentru a adăuga produse în coș!');
    window.location.href = 'login.html';
    return;
  }
  
  let cart = JSON.parse(localStorage.getItem('cart') || '{}');
  cart[productId] = (cart[productId] || 0) + 1;
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Produsul a fost adăugat în coș!');

  // Declanșăm un eveniment custom pentru a actualiza header-ul
  document.dispatchEvent(new Event('cartUpdated'));
}

});
