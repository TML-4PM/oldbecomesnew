document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
});

async function loadProducts() {
  try {
    // Fetch the product list JSON from the data folder (adjust path if necessary)
    const response = await fetch("../data/04_productList.json");
    const products = await response.json();
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = "";

    products.forEach((category) => {
      // Create a container for each category
      let categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category");
      categoryDiv.innerHTML = `<h3>${category.category}</h3>`;

      // Loop through each product and create UI elements
      category.items.forEach((product) => {
        let productDiv = document.createElement("div");
        productDiv.classList.add("product-item");

        // Create checkbox for product selection
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = product.sku;
        checkbox.value = product.sku;

        // Create label showing product name and price
        let label = document.createElement("label");
        label.htmlFor = product.sku;
        label.innerText = `${product.name} - $${parseFloat(product.price).toFixed(2)}`;

        // Create quantity input field
        let quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.id = `qty-${product.sku}`;
        quantityInput.min = "1";
        quantityInput.value = "1";
        quantityInput.classList.add("quantity-input");

        productDiv.appendChild(checkbox);
        productDiv.appendChild(label);
        productDiv.appendChild(quantityInput);
        categoryDiv.appendChild(productDiv);
      });

      productContainer.appendChild(categoryDiv);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function generateQuote() {
  let selectedProducts = [];
  let totalPrice = 0;

  // Iterate through all selected products
  const checkboxes = document.querySelectorAll("#product-list input[type='checkbox']:checked");
  checkboxes.forEach((checkbox) => {
    const sku = checkbox.value;
    const quantity = parseInt(document.getElementById(`qty-${sku}`).value) || 1;
    // Get product details from the label text (assumes "Product Name - $price")
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

  // Display quote summary and total price
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
    // Insert email functionality here
    alert(`Email sent to ${email}`);
  } else {
    alert("Please enter a valid email address.");
  }
}

function fetchQuote() {
  const email = document.getElementById("email").value;
  if (email) {
    // Insert functionality to fetch and pre-fill quote based on email here
    alert(`Fetching quote for ${email}`);
  } else {
    alert("Please enter a valid email address.");
  }
}

function scheduleJob() {
  // Insert job scheduling functionality here
  alert("Job scheduling feature is under development.");
}
