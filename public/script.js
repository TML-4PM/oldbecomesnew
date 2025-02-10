document.addEventListener("DOMContentLoaded", function () {
    loadProducts();
});

async function loadProducts() {
    try {
        const response = await fetch("../data/productList.json");
        const data = await response.json();
        const products = data.categories;

        const productContainer = document.getElementById("product-list");
        productContainer.innerHTML = '';

        products.forEach(category => {
            let categoryDiv = document.createElement("div");
            categoryDiv.innerHTML = `<h3>${category.category}</h3>`;
            
            category.items.forEach(product => {
                let productDiv = document.createElement("div");
                productDiv.innerHTML = `
                    <input type="checkbox" id="${product.sku}" value="${product.sku}">
                    <label for="${product.sku}">${product.name} - $${product.price.toFixed(2)}</label>
                    <input type="number" id="qty-${product.sku}" min="1" value="1" style="width: 50px; margin-left: 10px;">
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
        let sku = checkbox.value;
        let quantity = parseInt(document.getElementById(`qty-${sku}`).value) || 1;
        let product = findProductBySku(sku);
        if (product) {
            selectedProducts.push({ ...product, quantity });
            totalPrice += product.price * quantity;
        }
    });

    const summary = document.getElementById("quote-summary");
    summary.innerHTML = selectedProducts.map(p => `${p.name} (x${p.quantity}) - $${(p.price * p.quantity).toFixed(2)}`).join("<br>");

    document.getElementById("total-price").innerText = `Total: $${totalPrice.toFixed(2)}`;
}

function findProductBySku(sku) {
    const data = window.productData; // Assuming productData is stored globally after fetching
    for (let category of data.categories) {
        for (let item of category.items) {
            if (item.sku === sku) {
                return item;
            }
        }
    }
    return null;
}

function printQuote() {
    window.print();
}

function sendEmail() {
    const email = document.getElementById("email").value;
    if (email) {
        // Implement email sending functionality here
        alert(`Email sent to ${email}`);
    } else {
        alert("Please enter a valid email address.");
    }
}

function fetchQuote() {
    const email = document.getElementById("email").value;
    if (email) {
        // Implement functionality to fetch and pre-fill quote based on email
        alert(`Fetching quote for ${email}`);
    } else {
        alert("Please enter a valid email address.");
    }
}

function scheduleJob() {
    // Implement job scheduling functionality here
    alert("Job scheduling feature is under development.");
}
