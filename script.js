document.addEventListener("DOMContentLoaded", function () {

  // ================= REGISTER =================
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let nameVal = document.getElementById("name").value.trim();
      let emailVal = document.getElementById("email").value.trim();
      let passVal = document.getElementById("password").value;
      let confirmVal = document.getElementById("confirm").value;
      let msg = document.getElementById("msg");

      let users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.find(u => u.email === emailVal)) {
        msg.innerText = "Email already exists";
        return;
      }

      let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!regex.test(passVal)) {
        msg.innerText = "Password must be strong";
        return;
      }

      if (passVal !== confirmVal) {
        msg.innerText = "Passwords do not match";
        return;
      }

      users.push({ name: nameVal, email: emailVal, pass: passVal });
      localStorage.setItem("users", JSON.stringify(users));

      alert("Registered successfully!");
      window.location = "login.html";
    });
  }

  // ================= LOGIN =================
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let emailVal = document.getElementById("loginEmail").value;
      let passVal = document.getElementById("loginPassword").value;
      let loginMsg = document.getElementById("loginMsg");

      let users = JSON.parse(localStorage.getItem("users")) || [];
      let user = users.find(u => u.email === emailVal && u.pass === passVal);

      if (!user) {
        loginMsg.innerText = "Wrong email or password";
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      window.location = "dashboard.html";
    });
  }

  // ================= DASHBOARD =================
  if (document.getElementById("user")) {
    let u = JSON.parse(localStorage.getItem("user"));
    if (!u) window.location = "login.html";

    document.getElementById("user").innerText = u.name;
    loadProducts();
  }
});

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("user");
  window.location = "login.html";
}

// ================= PRODUCTS =================
let editIndex = null;

function openForm() {
  document.getElementById("modal").style.display = "block";
}

function closeForm() {
  document.getElementById("modal").style.display = "none";
}

function save() {
  let name = document.getElementById("pname").value;
  let cat = document.getElementById("pcat").value;
  let qty = parseInt(document.getElementById("pqty").value);
  let price = parseFloat(document.getElementById("pprice").value);

  if (!name || !cat || isNaN(qty) || isNaN(price) || qty < 0) {
    alert("Invalid input");
    return;
  }

  let products = JSON.parse(localStorage.getItem("products")) || [];

  if (editIndex !== null) {
    products[editIndex] = { name, cat, qty, price };
    editIndex = null;
  } else {
    products.push({ name, cat, qty, price });
  }

  localStorage.setItem("products", JSON.stringify(products));
  closeForm();
  loadProducts();
}

function loadProducts() {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let table = document.getElementById("table");

  if (!table) return;

  table.innerHTML = "";

  let inStockCount = 0;

  products.forEach((p, i) => {
    let status = p.qty > 0 ? "In Stock" : "Out";
    if (p.qty > 0) inStockCount++;

    table.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${p.name}</td>
        <td>${p.cat}</td>
        <td>${p.qty}</td>
        <td>${p.price}</td>
        <td>${status}</td>
        <td>
          <button onclick="editP(${i})">Edit</button>
          <button onclick="del(${i})">Delete</button>
        </td>
      </tr>`;
  });

  document.getElementById("total").innerText = products.length;
  document.getElementById("instock").innerText = inStockCount;
  document.getElementById("outstock").innerText = products.length - inStockCount;
}

function del(i) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  products.splice(i, 1);
  localStorage.setItem("products", JSON.stringify(products));
  loadProducts();
}

function editP(i) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  let p = products[i];

  document.getElementById("pname").value = p.name;
  document.getElementById("pcat").value = p.cat;
  document.getElementById("pqty").value = p.qty;
  document.getElementById("pprice").value = p.price;

  editIndex = i;
  openForm();
}
