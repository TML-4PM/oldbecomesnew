document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
});

async function loadProducts() {
  try {
    // Updated fetch URL: assumes the JSON file is in public/data/
    const response = await fetch("data/04_productList.json");
    const products = await response.json();

    // Debug: log fetched data to ensure it’s loaded correctly
    console.log("Fetched products:", products);

    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = "";

    products.forEach((category) => {
      // Create a container for each category
      let categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category");
      categoryDiv.innerHTML = `<h3>${category.category}</h3>`;

      // Loop through each product in the category
      category.items.forEach((product) => {
        let productDiv = document.createElement("div");
        productDiv.classList.add("product-item");

        // Create the checkbox for product selection
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
        quantityInput.classList.add("quantity-input");

        // Append elements to the product div
        productDiv.appendChild(checkbox);
        productDiv.appendChild(label);
        productDiv.appendChild(quantityInput);

        // Append the product div to the category container
        categoryDiv.appendChild(productDiv);
      });

      // Append the category container to the product list
      productContainer.appendChild(categoryDiv);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function generateQuote() {
  let selectedProducts = [];
  let totalPrice = 0;

  // Find all selected checkboxes
  const checkboxes = document.querySelectorAll("#product-list input[type='checkbox']:checked");
  checkboxes.forEach((checkbox) => {
    const sku = checkbox.value;
    const quantity = parseInt(document.getElementById(`qty-${sku}`).value) || 1;
    const label = document.querySelector(`label[for='${sku}']`).innerText;
    // Expecting label format "Product Name - $price"
    const [productName, priceText] = label.split(" - $");
    const price = parseFloat(priceText);
    const totalProductPrice = price * quantity;

    selectedProducts.push({
      name: productName,
      quantity: quantity,
      total: totalProductPrice,
    });

    totalPrice += totalProductPrice;
  });

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
    alert(`Email sent to ${email}`);
  } else {
    alert("Please enter a valid email address.");
  }
}

function fetchQuote() {
  const email = document.getElementById("email").value;
  if (email) {
    alert(`Fetching quote for ${email}`);
  } else {
    alert("Please enter a valid email address.");
  }
}

function scheduleJob() {
  alert("Job scheduling feature is under development.");
}
