document.addEventListener("DOMContentLoaded", function () {
    loadProducts();
});

async function loadProducts() {
    const response = await fetch("../data/04_productList.json");
    const products = await response.json();

    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = '';

    products.forEach(category => {
        let categoryDiv = document.createElement("div");
        categoryDiv.innerHTML = `<h3>${category.category}</h3>`;
        
        category.items.forEach(product => {
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
}

function generateQuote() {
    let selectedProducts = [];
    let totalPrice = 0;

    document.querySelectorAll("#product-list input[type='checkbox']:checked").forEach(checkbox => {
        let quantity = document.getElementById(`qty-${checkbox.value}`).value || 1;
        selectedProducts.push({ sku: checkbox.value, quantity: quantity });
    });

    const summary = document.getElementById("quote-summary");
    summary.innerHTML = selectedProducts.map(p => `${p.sku} x${p.quantity}`).join("<br>");

    document.getElementById("total-price").innerText = `Total: $${totalPrice}`;
}

function printQuote() {
    window.print();
}

function sendEmail() {
    alert("Email sent to troy.latter@unisys.com");
}
