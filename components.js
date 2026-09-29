/* =========================================================
   CYBERFLIX COMPONENT STORE — FINAL
========================================================= */

const products = [
  { id:1, category:"CPU", brand:"INTEL", name:"Intel Core i5-14600K", price:18000, oldPrice:20500, stock:"IN STOCK", image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Intel_Core_i5-14600K_(INVADERPC)_01.png" },
  { id:2, category:"CPU", brand:"AMD", name:"AMD Ryzen 7 7800X3D", price:32000, oldPrice:35500, stock:"IN STOCK", image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/AMD@5nmCCD(6nmIOD)@Zen4@Raphael@Ryzen_7_7800X3D@100-000000910_BS_2312PGY_9LW3390030138_DSCx01.jpg" },
  { id:3, category:"GPU", brand:"GIGABYTE", name:"GeForce RTX 4070 Super", price:50000, oldPrice:55000, stock:"IN STOCK", image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Video_%C3%BCber_die_RTX_4070_Super_und_Vergleichskarten_(%E6%9E%81%E5%AE%A2%E6%B9%BEGeekerwan)_03.png" },
  { id:4, category:"GPU", brand:"GIGABYTE", name:"GeForce RTX 4060", price:30000, oldPrice:33000, stock:"IN STOCK", image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Video_%C3%BCber_die_GeForce_RTX_4060_(%E6%9E%81%E5%AE%A2%E6%B9%BEGeekerwan)_05.png" },
  { id:5, category:"MOTHERBOARD", brand:"MSI", name:"B760 Gaming Plus WiFi", price:15000, oldPrice:17000, stock:"IN STOCK", image:"https://m.media-amazon.com/images/I/51lLktu5Z3L._AC_.jpg" },
  { id:6, category:"RAM", brand:"CORSAIR", name:"Vengeance RGB 32GB DDR5", price:11000, oldPrice:12500, stock:"IN STOCK", image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/2023_Pami%C4%99ci_Corsair_Vengeance_RGB.jpg" },
  { id:7, category:"STORAGE", brand:"SAMSUNG", name:"990 EVO Plus 2TB NVMe", price:9000, oldPrice:10500, stock:"IN STOCK", image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/SSD_Samsung_990_EVO_Plus_2TB,_Model_MZ-V9S2T0-2801.jpg" },
  { id:8, category:"PSU", brand:"CORSAIR", name:"RM750e 750W Gold", price:10000, oldPrice:11500, stock:"IN STOCK", image:"https://www.corsair.com/corsairmedia/sys_master/productcontent/CP-9020262-NA-RM750e-PSU-01.png" },
  { id:9, category:"CASE", brand:"ROSEWILL", name:"Airflow Gaming Case", price:6000, oldPrice:7000, stock:"IN STOCK", image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Rosewill_Gaming_Case.png" },
  { id:10, category:"COOLING", brand:"NZXT", name:"Kraken X52 240mm AIO", price:8000, oldPrice:9500, stock:"IN STOCK", image:"https://commons.wikimedia.org/wiki/Special:Redirect/file/NZXT_Kraken_X52_cooler_in_H500i.jpg" }
];

let activeCategory = "ALL";
let currentProducts = [...products];

function money(value){ return "₹" + Number(value).toLocaleString("en-IN"); }
function getLocalWishlist(){ try{return JSON.parse(localStorage.getItem("cyberflixWishlist")||"[]")}catch{return[]} }
function isWishlisted(id){return getLocalWishlist().some(x=>Number(x)===Number(id));}
function setLocalWishlist(list){localStorage.setItem("cyberflixWishlist",JSON.stringify(list));}
function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

function renderProducts(list=currentProducts){
  const grid=document.getElementById("productGrid");
  if(!grid)return;
  grid.innerHTML=list.map(p=>`\
    <article class="product-card">\
      <div class="product-image">\
        <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.style.opacity='.25'">\
        <button class="wishlist-btn ${isWishlisted(p.id)?'is-active':''}" data-wishlist="${p.id}" aria-label="Add ${escapeHtml(p.name)} to wishlist">${isWishlisted(p.id)?'♥':'♡'}</button>\
      </div>\
      <div class="product-info">\
        <div class="product-category">${escapeHtml(p.category)}</div>\
        <div class="product-name">${escapeHtml(p.name)}</div>\
        <div class="product-brand">${escapeHtml(p.brand)} · ${escapeHtml(p.stock)}</div>\
        <div class="product-price">${money(p.price)} <del>${money(p.oldPrice)}</del></div>\
        <div class="product-actions">\
          <button class="add-cart-btn" data-cart="${p.id}">ADD TO CART</button>\
          <a class="buy-btn" href="builder.html">BUILD</a>\
        </div>\
      </div>\
    </article>`).join("") || `<div class="empty-products">No components found.</div>`;
  const count=document.getElementById("productCount");
  if(count)count.textContent=list.length;
}

function applyFilters(){
  const q=(document.getElementById("searchInput")?.value||"").trim().toLowerCase();
  currentProducts=products.filter(p=>{
    const categoryOk=activeCategory==="ALL" || p.category===activeCategory;
    const searchOk=!q || `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q);
    return categoryOk && searchOk;
  });
  renderProducts(currentProducts);
}

function addToCart(id){
  const p=products.find(x=>x.id===Number(id)); if(!p)return;
  let cart=[]; try{cart=JSON.parse(localStorage.getItem("cyberflixCart")||"[]")}catch{}
  const existing=cart.find(x=>Number(x.id)===p.id);
  if(existing) existing.quantity=(Number(existing.quantity)||1)+1;
  else cart.push({...p,quantity:1});
  localStorage.setItem("cyberflixCart",JSON.stringify(cart));
  updateCartCount();
  alert(`${p.name} added to cart.`);
}

async function toggleWishlist(id){
  id=Number(id); if(!id)return;
  let list=getLocalWishlist();
  if(list.includes(id)) list=list.filter(x=>Number(x)!==id); else list.push(id);
  setLocalWishlist(list);
  try{
    const r=await fetch("/api/wishlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({productId:id})});
    if(r.ok){const data=await r.json(); if(data.action==="removed")setLocalWishlist(getLocalWishlist().filter(x=>Number(x)!==id));}
  }catch{}
  renderProducts(currentProducts);
}

function updateCartCount(){
  let cart=[];try{cart=JSON.parse(localStorage.getItem("cyberflixCart")||"[]")}catch{}
  const count=cart.reduce((s,x)=>s+(Number(x.quantity)||1),0);
  const el=document.getElementById("cartCount"); if(el)el.textContent=count;
}
function goToCart(){location.href="cart.html"}
function focusSearch(){const el=document.getElementById("searchInput");if(el){el.focus();el.scrollIntoView({behavior:"smooth",block:"center"})}}
function toggleMenu(){document.getElementById("mobileMenu")?.classList.toggle("show")}


document.addEventListener("DOMContentLoaded",()=>{
  renderProducts(); updateCartCount();
  document.querySelectorAll(".filter-btn").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active"); activeCategory=String(btn.dataset.category||"ALL").toUpperCase(); applyFilters();
  }));
  document.getElementById("searchInput")?.addEventListener("input",applyFilters);
  document.getElementById("sortProducts")?.addEventListener("change",e=>{
    const list=[...currentProducts];
    if(e.target.value==="low")list.sort((a,b)=>a.price-b.price);
    if(e.target.value==="high")list.sort((a,b)=>b.price-a.price);
    if(e.target.value==="name")list.sort((a,b)=>a.name.localeCompare(b.name));
    currentProducts=list; renderProducts(list);
  });
  document.addEventListener("click",e=>{
    const cart=e.target.closest("[data-cart]"); if(cart){e.preventDefault();addToCart(cart.dataset.cart);return;}
    const wish=e.target.closest("[data-wishlist]"); if(wish){e.preventDefault();toggleWishlist(wish.dataset.wishlist);}
  });
});

window.CyberflixProducts=products;
