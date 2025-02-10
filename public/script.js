// public/script.js

document.addEventListener("DOMContentLoaded", function () {
    loadProducts();
});

async function loadProducts() {
    try {
        const response = await fetch("../data/04_productList.json");
        const products = await response.json();

        const productContainer = document.getElementById("product-list");
        productContainer.innerHTML = '';

        products.forEach(category => {
            let categoryDiv = document.createElement("div");
            categoryDiv.innerHTML = `<h3>${category.category}</h3>`;
            
            category.items.forEach(product => {
                let productDiv = document.createElement("div");
                productDiv.classList.add("product-item");
                productDiv.innerHTML = `
                    <input type="checkbox" id="${product.sku}" value="${product.sku}">
                    <label for="${product.sku}">${product.name} - $${product.price.toFixed(2)}</label>
                    <input type="number" id="qty-${product.sku}" min="1" placeholder="Quantity" class="quantity-input">
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
    let selectedProducts = [];
    let totalPrice = 0;

    document.querySelectorAll("#product-list input[type='checkbox']:checked").forEach(checkbox => {
        let quantityInput = document.getElementById(`qty-${checkbox.value}`);
        let quantity = parseInt(quantityInput.value) || 1;
        let productLabel = document.querySelector(`label[for='${checkbox.value}']`).innerText;
        let price = parseFloat(productLabel.split('- $')[1]);
        let totalProductPrice = price * quantity;

        selectedProducts.push({ name: productLabel.split(' - $')[0], quantity: quantity, total: totalProductPrice });
        totalPrice += totalProductPrice;
    });

    const summary = document.getElementById("quote-summary");
    summary.innerHTML = selectedProducts.map(p => `${p.name} x${p.quantity} - $${p.total.toFixed(2)}`).join("<br>");

    document.getElementById("total-price").innerText = `Total: $${totalPrice.toFixed(2)}`;
}

function printQuote() {
    window.print();
}

function sendEmail() {
    const email = document.getElementById("email").value;
    if (email) {
        // Implement email functionality here
        alert(`Email sent to ${email}`);
    } else {
        alert("Please enter a valid email address.");
    }
}

function scheduleJob() {
    // Implement scheduling functionality here
    alert("Job scheduling feature is under development.");
}
