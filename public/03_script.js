// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

/**
 * Loads the product list from the JSON file and builds the UI.
 */
async function loadProducts() {
  try {
    // Fetch product data from "public/data/04_productList.json"
    const response = await fetch("data/04_productList.json");
    if (!response.ok) {
      throw new Error("Failed to load product data");
    }
    const categories = await response.json();

    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = ""; // Clear any existing content

    // Iterate through each category
    categories.forEach((category) => {
      // Create a container for this category
      const categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category-section");

      const categoryHeader = document.createElement("h3");
      categoryHeader.textContent = category.category;
      categoryDiv.appendChild(categoryHeader);

      // Iterate through each product in the category
      category.items.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product-item");

        // Create the checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = product.sku;
        checkbox.value = product.sku;
        productDiv.appendChild(checkbox);

        // Create the label (assumes label format: "Product Name - $Price")
        const label = document.createElement("label");
        label.setAttribute("for", product.sku);
        label.textContent = `${product.name} - $${product.price}`;
        productDiv.appendChild(label);

        // Create the quantity input
        const qtyInput = document.createElement("input");
        qtyInput.type = "number";
        qtyInput.id = `qty-${product.sku}`;
        qtyInput.min = "1";
        qtyInput.placeholder = "Quantity";
        qtyInput.value = "1";
        productDiv.appendChild(qtyInput);

        categoryDiv.appendChild(productDiv);
      });

      // Append the completed category section to the container
      productContainer.appendChild(categoryDiv);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

/**
 * Generates the quote based on selected products and service options.
 */
function generateQuote() {
  // Gather selected products and compute the product cost total.
  const selectedProducts = [];
  let productCostTotal = 0;

  const checkboxes = document.querySelectorAll("#product-list input[type='checkbox']");
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const sku = checkbox.value;
      const qtyInput = document.getElementById(`qty-${sku}`);
      const quantity = parseInt(qtyInput.value) || 1;
      selectedProducts.push({ sku, quantity });

      // Extract price from the label text using a RegExp
      const label = checkbox.nextElementSibling;
      const priceMatch = label.textContent.match(/\$([\d\.]+)/);
      if (priceMatch && priceMatch[1]) {
        const price = parseFloat(priceMatch[1]);
        productCostTotal += price * quantity;
      }
    }
  });

  // Get service job details from form inputs.
  const baseHours = parseFloat(document.getElementById("base-hours").value) || 0;
  const complexityMultiplier = parseFloat(document.getElementById("complexity").value) || 1.0;
  const serviceTypeMultiplier = parseFloat(document.getElementById("service-type").value) || 1.0;
  const stairs = document.getElementById("stairs").checked;
  const dataMigration = document.getElementById("data-migration").checked;
  const security = document.getElementById("security").checked;

  // Calculate the billable hours, applying multipliers and extra percentages.
  let billableHours = baseHours * complexityMultiplier * serviceTypeMultiplier;
  if (stairs) {
    billableHours += baseHours * 0.10; // +10%
  }
  if (dataMigration) {
    billableHours += baseHours * 0.50; // +50%
  }
  if (security) {
    billableHours += baseHours * 0.40; // +40%
  }
  billableHours = Math.ceil(billableHours);

  // Use an hourly rate to compute the service cost.
  const hourlyRate = 100; // For example, $100 per hour.
  const serviceCost = billableHours * hourlyRate;

  // Total cost = product cost + service cost.
  const totalCost = productCostTotal + serviceCost;

  // Update the UI with a summary of the selected options.
  const summaryContainer = document.getElementById("quote-summary");
  summaryContainer.innerHTML = `
    <h3>Selected Products:</h3>
    ${selectedProducts.map((p) => `${p.sku} x${p.quantity}`).join("<br>")}
    <h3>Service Details:</h3>
    Base Hours: ${baseHours} <br>
    Billable Hours: ${billableHours} <br>
    Service Cost (@$${hourlyRate}/hr): $${serviceCost}
  `;
  document.getElementById("total-price").textContent = `Total Price: $${totalCost.toFixed(2)}`;

  // Store the quote details globally for use with email and scheduling.
  window.currentQuote = {
    products: selectedProducts,
    productCost: productCostTotal,
    baseHours: baseHours,
    complexityMultiplier: complexityMultiplier,
    serviceTypeMultiplier: serviceTypeMultiplier,
    additionalFactors: { stairs, dataMigration, security },
    billableHours: billableHours,
    hourlyRate: hourlyRate,
    serviceCost: serviceCost,
    totalCost: totalCost,
    scheduleDate: document.getElementById("schedule-date").value || null,
    customerEmail: document.getElementById("email").value || null
  };

  // Optionally, log the quote details to your backend.
  logQuote(window.currentQuote);
}

/**
 * Logs the quote data via your backend API.
 */
function logQuote(quoteData) {
  fetch("/.netlify/functions/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ action: "logQuote", quote: quoteData })
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Quote logged:", data);
    })
    .catch((error) => {
      console.error("Error logging quote:", error);
    });
}

/**
 * Sends the current quote via email using your backend.
 */
function sendEmail() {
  if (!window.currentQuote) {
    alert("Please generate a quote first.");
    return;
  }
  fetch("/.netlify/functions/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ action: "sendEmail", quote: window.currentQuote })
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message || "Email sent successfully!");
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    });
}

/**
 * Schedules the job using your backend.
 */
function scheduleJob() {
  if (!window.currentQuote || !window.currentQuote.scheduleDate) {
    alert("Please select a schedule date and generate a quote.");
    return;
  }
  fetch("/.netlify/functions/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ action: "scheduleJob", quote: window.currentQuote })
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message || "Job scheduled successfully!");
    })
    .catch((error) => {
      console.error("Error scheduling job:", error);
      alert("Failed to schedule job.");
    });
}

/**
 * Prints the current page as a PDF.
 */
function printQuote() {
  window.print();
}

/**
 * Pre-fills the form based on the email provided.
 */
function fetchQuote() {
  const email = document.getElementById("email").value;
  if (!email) {
    alert("Please enter an email address.");
    return;
  }
  // Dummy auto-fill values
  document.getElementById("base-hours").value = 10;
  document.getElementById("complexity").value = "1.5";
  document.getElementById("service-type").value = "1.3";
  document.getElementById("stairs").checked = true;
  document.getElementById("data-migration").checked = false;
  document.getElementById("security").checked = true;
  alert(`Form pre-filled based on email: ${email}`);
}
