const products = [
  { id:1, name:"محصول یک", price:150000, img:"https://via.placeholder.com/150" },
  { id:2, name:"محصول دو", price:220000, img:"https://via.placeholder.com/150" },
  { id:3, name:"محصول سه", price:99000, img:"https://via.placeholder.com/150" },
  { id:4, name:"محصول چهار", price:340000, img:"https://via.placeholder.com/150" },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderProducts() {
  const el = document.getElementById('products');
  el.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="price">${p.price.toLocaleString()} تومان</div>
      <button onclick="addToCart(${p.id})">افزودن به سبد</button>
    </div>`).join('');
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  document.getElementById('cartCount').textContent = cart.length;
  const total = cart.reduce((sum, p) => sum + p.price, 0);
  document.getElementById('cartTotal').textContent = total.toLocaleString();
  document.getElementById('cartItems').innerHTML = cart.map(p =>
    `<div class="cart-item"><span>${p.name}</span><span>${p.price.toLocaleString()} تومان</span></div>`
  ).join('') || '<p>سبد خالی است</p>';
}

document.getElementById('cartBtn').onclick = () => document.getElementById('cartModal').classList.remove('hidden');
document.getElementById('closeCart').onclick = () => document.getElementById('cartModal').classList.add('hidden');

renderProducts();
updateCartUI();