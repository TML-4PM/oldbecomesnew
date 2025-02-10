// Placeholder for future API functions

// Example function to fetch product data
async function fetchProductData() {
    const response = await fetch('/data/productList.json');
    const data = await response.json();
    return data;
}

// Export functions for use in other parts of the application
export { fetchProductData };
