const products = [
  { id: 1, name: "تی‌شرت", cat: "پوشاک", price: 350000, img: "https://picsum.photos/300?1" },
  { id: 2, name: "هدفون", cat: "دیجیتال", price: 890000, img: "https://picsum.photos/300?2" },
  { id: 3, name: "کرم مرطوب‌کننده", cat: "زیبایی", price: 220000, img: "https://picsum.photos/300?3" }
];

let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let currentCat = "همه";

function renderCategories() {
  const cats = ["همه", ...new Set(products.map(p => p.cat))];
  document.getElementById("categories").innerHTML =
    cats.map(c => `<button onclick="setCat('${c}')">${c}</button>`).join("");
}

function setCat(c) { currentCat = c; renderProducts(); }

function renderProducts() {
  const list = currentCat === "همه" ? products : products.filter(p => p.cat === currentCat);
  document.getElementById("products").innerHTML = list.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price.toLocaleString("fa-IR")} تومان</p>
      <button onclick="addToCart(${p.id})">افزودن به سبد</button>
    </div>`).join("");
}

function addToCart(id) {
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCount();
}

function updateCount() {
  document.getElementById("cartCount").textContent = cart.length;
}

renderCategories(); renderProducts(); updateCount();