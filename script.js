const $ = id => document.getElementById(id);
const fmt = n => n.toLocaleString("fa-IR");

let cart = load("cart", {});
let currentCat = "همه";
let query = "";

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch (e) { return fallback; }
}
function saveCart() {
  try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {}
}

/* ---------- سه بخش اصلی ---------- */
function renderSections() {
  $("sections").innerHTML = SECTIONS.map(s => `
    <button class="sec" data-cat="${s.name}">
      <span class="sec-emoji">${s.emoji}</span>
      <span>${s.name}</span>
    </button>`).join("");
}

/* ---------- دسته‌ها و محصولات ---------- */
function renderCategories() {
  const cats = ["همه", ...SECTIONS.map(s => s.name)];
  $("categories").innerHTML = cats.map(c =>
    `<button class="${c === currentCat ? "active" : ""}" data-cat="${c}">${c}</button>`
  ).join("");
}

function renderProducts() {
  const list = products.filter(p =>
    (currentCat === "همه" || p.cat === currentCat) &&
    p.name.includes(query)
  );
  $("empty").hidden = list.length > 0;
  $("products").innerHTML = list.map(p => `
    <div class="card">
      <div class="emoji">${p.emoji}</div>
      <h3>${p.name}</h3>
      <span class="cat">${p.cat}</span>
      <div class="price">${fmt(p.price)} تومان</div>
      <button data-add="${p.id}">افزودن به سبد</button>
    </div>`).join("");
}

/* ---------- سبد خرید ---------- */
function cartTotal() {
  return Object.entries(cart).reduce((sum, [id, q]) => {
    const p = products.find(x => x.id == id);
    return sum + (p ? p.price * q : 0);
  }, 0);
}

function renderCart() {
  const entries = Object.entries(cart);
  $("cartCount").textContent = fmt(entries.reduce((s, [, q]) => s + q, 0));
  $("cartTotal").textContent = fmt(cartTotal());

  if (!entries.length) {
    $("cartItems").innerHTML = `<p class="empty">سبد خرید خالی است.</p>`;
    return;
  }
  $("cartItems").innerHTML = entries.map(([id, q]) => {
    const p = products.find(x => x.id == id);
    if (!p) return "";
    return `
      <div class="item">
        <div class="emoji">${p.emoji}</div>
        <div class="info">${p.name}<b>${fmt(p.price * q)} تومان</b></div>
        <div class="qty">
          <button data-inc="${id}">+</button>
          <span>${fmt(q)}</span>
          <button data-dec="${id}">−</button>
        </div>
      </div>`;
  }).join("");
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart(); renderCart(); toast("به سبد اضافه شد ✓");
}
function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(); renderCart();
}

function openCart()  { $("cartPanel").classList.add("open"); $("overlay").hidden = false; }
function closeCart() { $("cartPanel").classList.remove("open"); $("overlay").hidden = true; }

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1600);
}

/* ---------- ثبت سفارش ---------- */
function checkout() {
  const entries = Object.entries(cart);
  if (!entries.length) return toast("سبد خرید خالی است");

  const name = $("custName").value.trim();
  const phone = $("custPhone").value.trim();
  const addr = $("custAddr").value.trim();
  if (!name || !phone || !addr) return toast("نام، موبایل و آدرس را کامل کنید");

  let text = "سلام، سفارش جدید:\n\n";
  entries.forEach(([id, q]) => {
    const p = products.find(x => x.id == id);
    if (p) text += `• ${p.name} × ${q} = ${fmt(p.price * q)} تومان\n`;
  });
  text += `\nجمع کل: ${fmt(cartTotal())} تومان\n\n`;
  text += `نام: ${name}\nموبایل: ${phone}\nآدرس: ${addr}`;

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
}

/* ---------- رویدادها ---------- */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-cat],[data-add],[data-inc],[data-dec]");
  if (!el) return;
  if (el.dataset.cat) {
    currentCat = el.dataset.cat;
    renderCategories(); renderProducts();
    $("categories").scrollIntoView({ behavior: "smooth" });
  }
  if (el.dataset.add) addToCart(el.dataset.add);
  if (el.dataset.inc) changeQty(el.dataset.inc, 1);
  if (el.dataset.dec) changeQty(el.dataset.dec, -1);
});
$("cartBtn").onclick = openCart;
$("closeCart").onclick = closeCart;
$("overlay").onclick = closeCart;
$("checkoutBtn").onclick = checkout;
$("clearBtn").onclick = () => { cart = {}; saveCart(); renderCart(); };
$("search").oninput = e => { query = e.target.value.trim(); renderProducts(); };

/* ---------- شروع ---------- */
renderSections();
renderCategories();
renderProducts();
renderCart();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").catch(() => {});
}