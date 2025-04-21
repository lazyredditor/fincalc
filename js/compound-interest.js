// js/compound-interest.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('compound-interest-form');
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error-message');

    // --- Helper functions specific to this calc or potentially shared ---
    // Basic formatting, assumes main.js might not be loaded or used
    const formatCurrencyLocal = (value) => {
         if (isNaN(value)) return 'N/A';
         // Simple formatting, adjust locale or precision as needed
        return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const displayErrorLocal = (message) => {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        resultsDiv.style.display = 'none'; // Hide results on error
    };

     const clearErrorLocal = () => {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    };
    // --- End Helpers ---


    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent page reload
        clearErrorLocal(); // Clear previous errors

        // Get input values
        const principal = parseFloat(document.getElementById('principal').value);
        const rate = parseFloat(document.getElementById('rate').value);
        const time = parseFloat(document.getElementById('time').value);
        const compounding = parseInt(document.getElementById('compounding').value);

        // --- Input Validation ---
        if (isNaN(principal) || principal < 0) {
            displayErrorLocal('Please enter a valid positive Principal Amount.');
            return;
        }
        if (isNaN(rate) || rate < 0) {
            displayErrorLocal('Please enter a valid positive Annual Interest Rate.');
            return;
        }
         if (isNaN(time) || time <= 0) {
            displayErrorLocal('Please enter a valid Time Period (greater than 0).');
            return;
        }
         if (isNaN(compounding) || compounding <= 0) {
            displayErrorLocal('Please select a valid Compounding Frequency.');
            return;
        }
        // --- End Validation ---


        // --- Calculation Logic ---
        const ratePerPeriod = (rate / 100) / compounding;
        const numberOfPeriods = compounding * time;

        // Calculate Future Value (A) = P * (1 + r)^nt
        const futureValue = principal * Math.pow(1 + ratePerPeriod, numberOfPeriods);

        // Calculate Total Interest Earned
        const totalInterest = futureValue - principal;
        // --- End Calculation ---


        // --- Display Results ---
        resultsDiv.innerHTML = `
            <h4>Calculation Results:</h4>
            <p>Principal Amount: <strong>${formatCurrencyLocal(principal)}</strong></p>
            <p>Total Interest Earned: <strong>${formatCurrencyLocal(totalInterest)}</strong></p>
            <p>Future Value (Maturity Amount): <strong>${formatCurrencyLocal(futureValue)}</strong></p>
            <hr>
            <p><small>Calculated with an annual interest rate of ${rate}% compounded ${document.getElementById('compounding').options[document.getElementById('compounding').selectedIndex].text.toLowerCase()} over ${time} years.</small></p>
        `;
        resultsDiv.style.display = 'block'; // Show results area
        // --- End Display Results ---
    });
});