document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
});

async function loadProducts() {
  try {
    const response = await fetch("../data/04_productList.json");
    const products = await response.json();

    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = "";

    products.forEach((category) => {
      let categoryDiv = document.createElement("div");
      categoryDiv.innerHTML = `<h3>${category.category}</h3>`;

      category.items.forEach((product) => {
        let productDiv = document.createElement("div");
        productDiv.innerHTML = `
          <input type="checkbox" id="${product.sku}" value="${product.sku}">
          <label for="${product.sku}">${product.name} - $${product.price}</label>
          <input type="number" id="qty-${product.sku}" min="1" placeholder="Quantity">
        `;
        categoryDiv.appendChild(productDiv);
      });

      productContainer.appendChild(categoryDiv);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function generateQuote() {
  // Gather selected products and compute their cost
  let selectedProducts = [];
  let productCostTotal = 0;

  document.querySelectorAll("#product-list input[type='checkbox']:checked").forEach((checkbox) => {
    let quantity = parseInt(
      document.getElementById(`qty-${checkbox.value}`).value
    ) || 1;
    selectedProducts.push({ sku: checkbox.value, quantity: quantity });

    // Look up price from the label (a production solution would use a proper data model)
    const priceElement = checkbox.nextElementSibling.textContent;
    const priceMatch = priceElement.match(/\$(\d+(\.\d+)?)/);
    if (priceMatch) {
      let price = parseFloat(priceMatch[1]);
      productCostTotal += price * quantity;
    }
  });

  // Gather service job details
  const baseHours = parseFloat(document.getElementById("base-hours").value) || 0;
  const complexityMultiplier = parseFloat(
    document.getElementById("complexity").value
  );
  const serviceTypeMultiplier = parseFloat(
    document.getElementById("service-type").value
  );
  const stairs = document.getElementById("stairs").checked;
  const dataMigration = document.getElementById("data-migration").checked;
  const security = document.getElementById("security").checked;

  // Calculate service job billable hours based on multipliers and extra factors
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

  // Define an hourly rate (this can come from a config or database)
  const hourlyRate = 100; // $100 per hour, for example
  const serviceCost = billableHours * hourlyRate;

  // Total cost is the sum of product cost plus service cost
  const totalCost = productCostTotal + serviceCost;

  // Display the summary
  const summary = document.getElementById("quote-summary");
  summary.innerHTML = `
    <h3>Selected Products:</h3>
    ${selectedProducts.map((p) => `${p.sku} x${p.quantity}`).join("<br>")}
    <h3>Service Details:</h3>
    Base Hours: ${baseHours} <br>
    Billable Hours (after multipliers): ${billableHours} <br>
    Service Cost (@$${hourlyRate}/hr): $${serviceCost}
  `;

  document.getElementById("total-price").innerText =
    `Total Price: $${totalCost.toFixed(2)}`;

  // Store quote data globally for further use (email, scheduling, CSV logging)
  window.currentQuote = {
    products: selectedProducts,
    productCost: productCostTotal,
    baseHours: baseHours,
    complexityMultiplier: complexityMultiplier,
    serviceTypeMultiplier: serviceTypeMultiplier,
    additionalFactors: {
      stairs: stairs,
      dataMigration: dataMigration,
      security: security,
    },
    billableHours: billableHours,
    hourlyRate: hourlyRate,
    serviceCost: serviceCost,
    totalCost: totalCost,
    scheduleDate: document.getElementById("schedule-date").value || null,
    customerEmail: document.getElementById("email").value || null,
  };

  // Log quote data to backend for CSV logging
  logQuote(window.currentQuote);
}

function printQuote() {
  window.print();
}

function sendEmail() {
  if (!window.currentQuote) {
    alert("Please generate a quote first.");
    return;
  }
  // Call the backend to send an email with a PDF attachment
  fetch("/.netlify/functions/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "sendEmail", quote: window.currentQuote }),
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

function scheduleJob() {
  if (!window.currentQuote || !window.currentQuote.scheduleDate) {
    alert("Please select a schedule date and generate a quote.");
    return;
  }
  // Call the backend to schedule the job (or integrate with a calendar API)
  fetch("/.netlify/functions/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "scheduleJob", quote: window.currentQuote }),
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

function logQuote(quoteData) {
  // Log the quote to CSV via the backend API
  fetch("/.netlify/functions/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "logQuote", quote: quoteData }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Quote logged:", data);
    })
    .catch((error) => {
      console.error("Error logging quote:", error);
    });
}

function fetchQuote() {
  // (Simulated) Auto-fill form based on the email input.
  const email = document.getElementById("email").value;
  if (!email) return;
  // In production you might fetch saved data from your backend.
  document.getElementById("base-hours").value = 10;
  document.getElementById("complexity").value = "1.5";
  document.getElementById("service-type").value = "1.3";
  document.getElementById("stairs").checked = true;
  document.getElementById("data-migration").checked = false;
  document.getElementById("security").checked = true;
  alert("Form pre-filled based on email!");
}
