// cart.js

document.addEventListener("DOMContentLoaded", renderCart);

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart");
  const totalDiv = document.getElementById("total");

  container.innerHTML = "";
  totalDiv.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Cart is empty</p>";
    return;
  }

  let total = 0;

  cart.forEach(item => {
    // Validate item data
    const itemName = item.name || "Unknown Product";
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.qty) || 1;

    total += itemPrice * itemQty;

    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${itemName}</h4>
      <p>₹${itemPrice}</p>
      <p>Qty: ${itemQty}</p>
      <button onclick="inc('${item._id}')">+</button>
      <button onclick="dec('${item._id}')">−</button>
      <button onclick="removeItem('${item._id}')">Remove</button>
      <hr>
    `;

    container.appendChild(div);
  });

  totalDiv.innerText = "Total: ₹" + total;
}
function inc(id) {
  const cart = getCart();
  const item = cart.find(p => p._id === String(id));

  if (!item) return;

  item.qty++;
  saveCart(cart);
  renderCart();
}

function dec(id) {
  let cart = getCart();
  const item = cart.find(p => p._id === String(id));

  if (!item) return;

  if (item.qty > 1) {
    item.qty--;
  } else {
    cart = cart.filter(p => p._id !== String(id));
  }

  saveCart(cart);
  renderCart();
}
function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
}
function removeItem(id) {
  const cart = getCart().filter(p => p._id !== id);
  saveCart(cart);
  renderCart();
}