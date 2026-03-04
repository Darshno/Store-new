// checkout.js

const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {
  alert("Cart is empty");
  window.location.href = "index.html";
}

// Render order summary
const summaryDiv = document.getElementById("summary");

let total = 0;
cart.forEach(item => {
  total += item.price * item.qty;

  summaryDiv.innerHTML += `
    <p>
      ${item.name} × ${item.qty} — ₹${item.price * item.qty}
    </p>
  `;
});

summaryDiv.innerHTML += `<hr><h3>Total: ₹${total}</h3>`;

// Place order
async function placeOrder() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill all details");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to place order");
    window.location.href = "client.html";
    return;
  }

  // FINAL ORDER OBJECT
  const order = {
    customer: {
      name,
      phone,
      address
    },
    items: cart,
    total,
    status: "placed",
    createdAt: new Date()
  };

  console.log("ORDER:", order);

  try {
    const response = await fetch(API_ENDPOINTS.orders, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(order)
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error:", errorText);
      alert("Error placing order. Please check console for details.");
      return;
    }

    const result = await response.json();

    alert("Order placed successfully!");

    localStorage.removeItem("cart");
    window.location.href = "orders.html";
  } catch (err) {
    console.error("Error:", err);
    alert("Error placing order: " + err.message);
  }
}
