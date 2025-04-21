// js/main.js

// Function to format currency (example)
function formatCurrency(value) {
    // Basic formatting, you might want locale-specific later
    return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    // return value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }); // Example for INR
}

// Function to display error messages
function displayError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block'; // Show the error
    }
}

// Function to clear error messages
function clearError(elementId) {
     const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none'; // Hide the error
    }
}

// Function to display results
function displayResults(resultsHtml) {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.innerHTML = resultsHtml; // Set the HTML content
        resultsDiv.style.display = 'block';  // Make sure it's visible
    }
}

// Add common utility functions here if needed across multiple calculators
console.log("main.js loaded"); // For debugging