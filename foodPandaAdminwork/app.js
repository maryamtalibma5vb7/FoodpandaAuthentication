// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBbrt0Wb9NIDajEbm151QNAFp_eZ0LnO6Y",
  authDomain: "food-2868c.firebaseapp.com",
  projectId: "food-2868c",
  storageBucket: "food-2868c.appspot.com",
  messagingSenderId: "925211173677",
  appId: "1:925211173677:web:4038daee9180d9121b69a4",
  measurementId: "G-YY73WWGYQC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup function
function handleSignup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      Swal.fire({
        title: "User Signed Up Successfully",
        text: `${user.email}`,
        icon: "success",
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops ...",
        text: "Invalid Credentials",
      });
    });
}
window.handleSignup = handleSignup;

// Login function
function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      Swal.fire({
        title: "User Signed In Successfully",
        text: `${user.email}`,
        icon: "success",
      }).then(() => {
        location.href = "./admin.html";
      });
    })
    .catch(() => {
      Swal.fire({
        icon: "error",
        title: "Oops ...",
        text: "Invalid Credentials",
      });
    });
}
window.handleLogin = handleLogin;

// Logout function
function logoutUser() {
  signOut(auth)
    .then(() => {
      Swal.fire({
        title: "User Signed Out Successfully",
        text: "Byee Byee <3",
        icon: "success",
      }).then(() => {
        window.location.href = "login.html";
      });
    })
    .catch((error) => {
      console.error("Error signing out:", error);
      Swal.fire({
        icon: "error",
        title: "Oops ...",
        text: "Abhi na jaao chor kar 💔",
      });
    });
}
window.logoutUser = logoutUser;

// Add product
async function addProducts() {
  getProductListDiv.innerHTML = "";

  const product_id = document.getElementById("productId").value;
  const product_name = document.getElementById("productName").value;
  const product_price = document.getElementById("productPrice").value;
  const product_des = document.getElementById("productDesc").value;
  const product_url = document.getElementById("productImage").value;

  try {
    const docRef = await addDoc(collection(db, "items"), {
      product_id,
      product_name,
      product_price,
      product_des,
      product_url,
    });
    Swal.fire({
      title: "Product Added Successfully",
      text: `Your order ID is ${docRef.id}`,
      icon: "success",
    });
    getProductList();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
window.addProducts = addProducts;

// DOM reference
let getProductListDiv = document.getElementById("product-list");

// Fetch product list
async function getProductList() {
  getProductListDiv.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "items"));

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    getProductListDiv.innerHTML += `
      <div class="card" style="width: 22rem;">
        <img src="${data.product_url}" class="card-img-top" alt="Image">
        <div class="card-body">
          <h5 class="card-title">${data.product_name}</h5>
          <p class="card-text">${data.product_des}</p>
          <h5 class="card-title">${data.product_price}</h5>
          <button onclick='openEditModal("${docSnap.id}", "${data.product_name}", "${data.product_price}", "${data.product_des}", "${data.product_url}")' class='btn btn-info'> Edit </button>
          <button onclick='delItem("${docSnap.id}")' class='btn btn-danger'> Delete </button>
        </div>
      </div>`;
  });
}
if (getProductListDiv) getProductList();

// Delete product
async function delItem(id) {
  getProductListDiv.innerHTML = "";
  const ref = doc(db, "items", id);
  await deleteDoc(ref);
  getProductList();
}
window.delItem = delItem;

// Open modal for editing
window.openEditModal = function (id, name, price, desc, url) {
  document.getElementById("editProductId").value = id;
  document.getElementById("editProductName").value = name;
  document.getElementById("editProductPrice").value = price;
  document.getElementById("editProductDesc").value = desc;
  document.getElementById("editProductImage").value = url;

  const editModal = new bootstrap.Modal(
    document.getElementById("editProductModal")
  );
  editModal.show();
};

// Save changes after editing
window.saveProductChanges = async function () {
  const id = document.getElementById("editProductId").value;
  const name = document.getElementById("editProductName").value;
  const price = document.getElementById("editProductPrice").value;
  const desc = document.getElementById("editProductDesc").value;
  const url = document.getElementById("editProductImage").value;

  const productRef = doc(db, "items", id);

  try {
    await updateDoc(productRef, {
      product_name: name,
      product_price: price,
      product_des: desc,
      product_url: url,
    });

    Swal.fire({
      title: "Updated!",
      text: "Product updated successfully.",
      icon: "success",
    });

    getProductListDiv.innerHTML = "";
    getProductList();

    bootstrap.Modal.getInstance(
      document.getElementById("editProductModal")
    ).hide();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: error.message,
    });
  }
};
