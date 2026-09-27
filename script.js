// ---------- داده محصولات نمونه ----------
// این آرایه رو با محصولات واقعی خودت جایگزین کن
const PRODUCTS = [
  { id:1, name:"تیشرت نخی ساده", cat:"fashion", price:185000, emoji:"👕", color:"#F1E4D0" },
  { id:2, name:"کتونی روزمره", cat:"fashion", price:890000, emoji:"👟", color:"#E4E9F0" },
  { id:3, name:"هدفون بی‌سیم", cat:"digital", price:1250000, emoji:"🎧", color:"#E8E3F5" },
  { id:4, name:"پاوربانک 10000", cat:"digital", price:410000, emoji:"🔋", color:"#DCEEE7" },
  { id:5, name:"ست ظروف آشپزخانه", cat:"home", price:960000, emoji:"🍳", color:"#F5E7D8" },
  { id:6, name:"شمع معطر", cat:"home", price:145000, emoji:"🕯️", color:"#F0E0DC" },
  { id:7, name:"کرم مرطوب‌کننده", cat:"beauty", price:220000, emoji:"🧴", color:"#F5E1EA" },
  { id:8, name:"رژ لب مات", cat:"beauty", price:165000, emoji:"💄", color:"#F7DDE1" },
  { id:9, name:"توپ فوتبال", cat:"sport", price:390000, emoji:"⚽", color:"#DFF0E1" },
  { id:10, name:"مت یوگا", cat:"sport", price:275000, emoji:"🧘", color:"#E3EFE9" },
  { id:11, name:"عسل طبیعی 1 کیلویی", cat:"food", price:480000, emoji:"🍯", color:"#F7EAD0" },
  { id:12, name:"بسته چای خوش‌عطر", cat:"food", price:135000, emoji:"🍵", color:"#E6EEE0" },
];

const CAT_LABELS = { fashion:"پوشاک", digital:"دیجیتال", home:"خانه", beauty:"زیبایی", sport:"ورزش", food:"خوراکی" };

// ---------- وضعیت ----------
let activeCat = "all";
let searchTerm = "";
let cart = JSON.parse(localStorage.getItem("bazarcheh_cart") || "{}");

// ---------- عناصر ----------
const grid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const sectionTitle = document.getElementById("sectionTitle");
const cartCountEl = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");

function toman(n){ return n.toLocaleString("fa-IR") + " تومان"; }

function saveCart(){
  localStorage.setItem("bazarcheh_cart", JSON.stringify(cart));
  renderCartBadge();
}

function renderCartBadge(){
  const count = Object.values(cart).reduce((a,b)=>a+b.qty,0);
  cartCountEl.textContent = count;
}

function renderProducts(){
  const filtered = PRODUCTS.filter(p=>{
    const matchesCat = activeCat === "all" || p.cat === activeCat;
    const matchesSearch = p.name.includes(searchTerm.trim());
    return matchesCat && matchesSearch;
  });

  sectionTitle.textContent = activeCat === "all" ? "پیشنهاد امروز" : CAT_LABELS[activeCat];
  resultCount.textContent = filtered.length ? `${filtered.length} کالا` : "";
  grid.innerHTML = "";
  emptyState.hidden = filtered.length !== 0;

  filtered.forEach(p=>{
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-thumb" style="background:${p.color}">${p.emoji}</div>
      <div class="product-body">
        <span class="product-cat">${CAT_LABELS[p.cat]}</span>
        <p class="product-name">${p.name}</p>
        <div class="product-bottom">
          <span class="product-price">${toman(p.price)}</span>
          <button class="add-btn" data-id="${p.id}" aria-label="افزودن به سبد">+</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function renderCart(){
  const ids = Object.keys(cart);
  if(ids.length === 0){
    cartItemsEl.innerHTML = `<p class="cart-empty">سبد خریدت خالیه.</p>`;
    cartTotalEl.textContent = toman(0);
    return;
  }
  let total = 0;
  cartItemsEl.innerHTML = ids.map(id=>{
    const item = cart[id];
    const product = PRODUCTS.find(p=>p.id == id);
    total += product.price * item.qty;
    return `
      <div class="cart-line">
        <div class="thumb" style="background:${product.color}">${product.emoji}</div>
        <div class="info">
          <p>${product.name}</p>
          <div class="qty-row">
            <button class="qty-btn" data-action="dec" data-id="${id}">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${id}">+</button>
          </div>
        </div>
        <strong>${toman(product.price * item.qty)}</strong>
      </div>`;
  }).join("");
  cartTotalEl.textContent = toman(total);
}

function addToCart(id){
  if(!cart[id]) cart[id] = { qty:0 };
  cart[id].qty += 1;
  saveCart();
  renderCart();
}

function changeQty(id, delta){
  if(!cart[id]) return;
  cart[id].qty += delta;
  if(cart[id].qty <= 0) delete cart[id];
  saveCart();
  renderCart();
}

// ---------- رویدادها ----------
document.getElementById("catChips").addEventListener("click", e=>{
  const chip = e.target.closest(".chip");
  if(!chip) return;
  document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
  chip.classList.add("active");
  activeCat = chip.dataset.cat;
  renderProducts();
});

document.getElementById("searchInput").addEventListener("input", e=>{
  searchTerm = e.target.value;
  renderProducts();
});

grid && document.getElementById("productGrid").addEventListener("click", e=>{
  const btn = e.target.closest(".add-btn");
  if(!btn) return;
  addToCart(btn.dataset.id);
});

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
function openCart(){ cartDrawer.classList.add("open"); cartOverlay.classList.add("open"); }
function closeCartFn(){ cartDrawer.classList.remove("open"); cartOverlay.classList.remove("open"); }
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCartFn);
cartOverlay.addEventListener("click", closeCartFn);

cartItemsEl.addEventListener("click", e=>{
  const btn = e.target.closest(".qty-btn");
  if(!btn) return;
  changeQty(btn.dataset.id, btn.dataset.action === "inc" ? 1 : -1);
});

document.getElementById("checkoutBtn").addEventListener("click", ()=>{
  if(Object.keys(cart).length === 0) return;
  alert("اینجا باید به درگاه پرداخت (مثلاً زرین‌پال) وصل بشه.");
});

document.getElementById("menuBtn").addEventListener("click", ()=>{
  document.getElementById("catChips").scrollIntoView({behavior:"smooth", block:"center"});
});

// ---------- نصب PWA ----------
let deferredPrompt;
const installToast = document.getElementById("installToast");
window.addEventListener("beforeinstallprompt", (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  if(!localStorage.getItem("bazarcheh_install_dismissed")){
    installToast.classList.add("show");
  }
});
document.getElementById("installBtn").addEventListener("click", async ()=>{
  installToast.classList.remove("show");
  if(deferredPrompt){
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  }
});
document.getElementById("dismissInstall").addEventListener("click", ()=>{
  installToast.classList.remove("show");
  localStorage.setItem("bazarcheh_install_dismissed", "1");
});

// ---------- ثبت service worker ----------
if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>{
    navigator.serviceWorker.register("service-worker.js").catch(()=>{});
  });
}

// ---------- شروع ----------
renderProducts();
renderCart();
renderCartBadge();