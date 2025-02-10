// public/script.js

document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
});

async function loadProducts() {
  try {
    // Fetch the products JSON (ensure the file exists at ../data/04_productList.json)
    const response = await fetch("../data/04_productList.json");
    const products = await response.json();
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = "";

    products.forEach((category) => {
      // Create a container for the category
      let categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category");
      categoryDiv.innerHTML = `<h3>${category.category}</h3>`;

      // Loop through each product in the category
      category.items.forEach((product) => {
        let productDiv = document.createElement("div");
        productDiv.classList.add("product-item");

        // Create the checkbox for selecting the product
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = product.sku;
        checkbox.value = product.sku;

        // Create the label with product name and price
        let label = document.createElement("label");
        label.htmlFor = product.sku;
        label.innerText = `${product.name} - $${parseFloat(product.price).toFixed(2)}`;

        // Create the quantity input field
        let quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.id = `qty-${product.sku}`;
        quantityInput.min = "1";
        quantityInput.value = "1";
        quantityInput.style.width = "50px";
        quantityInput.style.marginLeft = "10px";

        // Append checkbox, label, and quantity input to the product container
        productDiv.appendChild(checkbox);
        productDiv.appendChild(label);
        productDiv.appendChild(quantityInput);

        // Append the productDiv to the categoryDiv
        categoryDiv.appendChild(productDiv);
      });

      // Append the entire categoryDiv to the product list container
      productContainer.appendChild(categoryDiv);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function generateQuote() {
  let selectedProducts = [];
  let totalPrice = 0;

  // Find all checked products
  const checkboxes = document.querySelectorAll("#product-list input[type='checkbox']:checked");
  checkboxes.forEach((checkbox) => {
    const sku = checkbox.value;
    const quantity = parseInt(document.getElementById(`qty-${sku}`).value) || 1;

    // Retrieve the label text; assuming the label format "Product Name - $price"
    const label = document.querySelector(`label[for='${sku}']`).innerText;
    const parts = label.split(" - $");
    const productName = parts[0];
    const price = parseFloat(parts[1]);
    const totalProductPrice = price * quantity;

    selectedProducts.push({
      name: productName,
      quantity: quantity,
      total: totalProductPrice,
    });

    totalPrice += totalProductPrice;
  });

  // Update the quote summary
  const summary = document.getElementById("quote-summary");
  summary.innerHTML = selectedProducts
    .map((p) => `${p.name} x${p.quantity} - $${p.total.toFixed(2)}`)
    .join("<br>");

  document.getElementById("total-price").innerText = `Total: $${totalPrice.toFixed(2)}`;
}

function printQuote() {
  window.print();
}

function sendEmail() {
  const email = document.getElementById("email").value;
  if (email) {
    // Implement your email functionality here
    alert(`Email sent to ${email}`);
  } else {
    alert("Please enter a valid email address.");
  }
}

function fetchQuote() {
  const email = document.getElementById("email").value;
  if (email) {
    // Implement functionality to fetch and pre-fill a quote based on email here
    alert(`Fetching quote for ${email}`);
  } else {
    alert("Please enter a valid email address.");
  }
}

function scheduleJob() {
  // Implement job scheduling functionality here
  alert("Job scheduling feature is under development.");
}
