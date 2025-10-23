
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    const admin = { email: "admin@example.com", password: "123456", role: "admin" };
    const user = { email: "user@example.com", password: "123456", role: "user" };

    if (email === admin.email && password === admin.password) {
      localStorage.setItem("currentUser", JSON.stringify(admin));
      window.location.href = "admin.html";
    } else if (email === user.email && password === user.password) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      window.location.href = "home.html";
    } else {
      errorMsg.textContent = "Email hoặc mật khẩu sai!";
    }
  };
}


const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (document.querySelector(".admin-container")) {
  if (!currentUser || currentUser.role !== "admin") {
    alert("Bạn không có quyền truy cập!");
    window.location.href = "login.html";
  }

  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  };

  
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const userForm = document.getElementById("userForm");
  const userTable = document.getElementById("userTable");

  function renderUsers() {
    userTable.innerHTML = `
      <tr><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Hành động</th></tr>`;
    users.forEach((u, i) => {
      userTable.innerHTML += `
        <tr>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.role}</td>
          <td>
            <button onclick="editUser(${i})">Sửa</button>
            <button onclick="deleteUser(${i})">Xóa</button>
          </td>
        </tr>`;
    });
  }

  userForm.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const role = document.getElementById("userRole").value;

    const index = userForm.dataset.index;
    if (index) {
      users[index] = { name, email, role };
      delete userForm.dataset.index;
    } else {
      users.push({ name, email, role });
    }
    localStorage.setItem("users", JSON.stringify(users));
    userForm.reset();
    renderUsers();
  };

  window.editUser = (i) => {
    const u = users[i];
    document.getElementById("userName").value = u.name;
    document.getElementById("userEmail").value = u.email;
    document.getElementById("userRole").value = u.role;
    userForm.dataset.index = i;
  };

  window.deleteUser = (i) => {
    if (confirm("Xóa người dùng này?")) {
      users.splice(i, 1);
      localStorage.setItem("users", JSON.stringify(users));
      renderUsers();
    }
  };

  renderUsers();

  
  let products = JSON.parse(localStorage.getItem("products")) || [];
  const productForm = document.getElementById("productForm");
  const productTable = document.getElementById("productTable");

  function renderProducts() {
    productTable.innerHTML = `
      <tr><th>Tên</th><th>Giá</th><th>Mô tả</th><th>Ảnh</th><th>Hành động</th></tr>`;
    products.forEach((p, i) => {
      productTable.innerHTML += `
        <tr>
          <td>${p.name}</td>
          <td>${p.price}</td>
          <td>${p.desc}</td>
          <td><img src="${p.img}" width="50"></td>
          <td>
            <button onclick="editProduct(${i})">Sửa</button>
            <button onclick="deleteProduct(${i})">Xóa</button>
          </td>
        </tr>`;
    });
  }

  productForm.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const price = +document.getElementById("productPrice").value;
    const desc = document.getElementById("productDesc").value;
    const img = document.getElementById("productImg").value;

    const index = productForm.dataset.index;
    if (index) {
      products[index] = { name, price, desc, img };
      delete productForm.dataset.index;
    } else {
      products.push({ name, price, desc, img });
    }
    localStorage.setItem("products", JSON.stringify(products));
    productForm.reset();
    renderProducts();
  };

  window.editProduct = (i) => {
    const p = products[i];
    document.getElementById("productName").value = p.name;
    document.getElementById("productPrice").value = p.price;
    document.getElementById("productDesc").value = p.desc;
    document.getElementById("productImg").value = p.img;
    productForm.dataset.index = i;
  };

  window.deleteProduct = (i) => {
    if (confirm("Xóa sản phẩm này?")) {
      products.splice(i, 1);
      localStorage.setItem("products", JSON.stringify(products));
      renderProducts();
    }
  };

  renderProducts();
}


if (document.querySelector(".products")) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const productList = document.getElementById("productList");
  const cartDiv = document.getElementById("cart");
  const totalSpan = document.getElementById("total");

  function renderProductsHome() {
    productList.innerHTML = "";
    if (products.length === 0) {
      productList.innerHTML = "<p>Chưa có sản phẩm nào!</p>";
      return;
    }
    products.forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <img src="${p.img || 'https://via.placeholder.com/150'}">
        <h4>${p.name}</h4>
        <p>${p.desc}</p>
        <p><b>${p.price}</b> VNĐ</p>
        <button onclick="addToCart(${i})">Thêm vào giỏ</button>`;
      productList.appendChild(div);
    });
  }

  function renderCart() {
    cartDiv.innerHTML = "";
    let total = 0;
    if (cart.length === 0) {
      cartDiv.innerHTML = "<p>Giỏ hàng trống!</p>";
    } else {
      cart.forEach((item, i) => {
        total += item.price;
        cartDiv.innerHTML += `
          <div>${item.name} - ${item.price} VNĐ 
          <button onclick="removeFromCart(${i})">Xóa</button></div>`;
      });
    }
    totalSpan.textContent = total.toLocaleString();
  }

  window.addToCart = (i) => {
    const product = products[i];
    const exists = cart.find((c) => c.name === product.name);
    if (exists) return alert("Sản phẩm đã có trong giỏ!");
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  window.removeFromCart = (i) => {
    cart.splice(i, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  document.getElementById("checkoutBtn").onclick = () => {
    if (cart.length === 0) return alert("Giỏ hàng trống!");
    alert("Thanh toán thành công!");
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
  };

  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  };

  renderProductsHome();
  renderCart();
}
