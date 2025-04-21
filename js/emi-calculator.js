// js/emi-calculator.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('emi-calculator-form');
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error-message');
    const calculatorTypeRadios = document.querySelectorAll('input[name="emi-type"]');

    // Input field groups
    const groupLoanAmount = document.getElementById('group-loan-amount');
    const groupRate = document.getElementById('group-rate');
    const groupTenure = document.getElementById('group-tenure');
    const groupEmi = document.getElementById('group-emi');

    // Input fields
    const loanAmountInput = document.getElementById('loan-amount');
    const rateInput = document.getElementById('rate');
    const tenureValueInput = document.getElementById('tenure-value');
    const tenureUnitSelect = document.getElementById('tenure-unit');
    const emiInput = document.getElementById('emi');

    // --- Helper functions ---
    const formatCurrencyLocal = (value) => {
        if (isNaN(value) || !isFinite(value)) return 'N/A';
        return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
     const displayErrorLocal = (message) => {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        resultsDiv.style.display = 'none';
    };
    const clearErrorLocal = () => {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    };
    // --- End Helpers ---

    // --- Function to update visible fields based on calculator type ---
    function updateFormFields() {
        const selectedType = document.querySelector('input[name="emi-type"]:checked').value;

        // Hide all initially
        groupLoanAmount.style.display = 'none';
        groupRate.style.display = 'none';
        groupTenure.style.display = 'none';
        groupEmi.style.display = 'none';

        // Show based on selection
        groupRate.style.display = 'block'; // Rate is always needed

        if (selectedType === 'emi') {
            groupLoanAmount.style.display = 'block';
            groupTenure.style.display = 'block';
        } else if (selectedType === 'loan-amount') {
            groupEmi.style.display = 'block';
            groupTenure.style.display = 'block';
        } else if (selectedType === 'tenure') {
            groupLoanAmount.style.display = 'block';
            groupEmi.style.display = 'block';
        }

        // Clear inputs and results when type changes
        loanAmountInput.value = '';
        rateInput.value = '';
        tenureValueInput.value = '';
        emiInput.value = '';
        clearErrorLocal();
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
    }

    // Add event listeners to radio buttons
    calculatorTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateFormFields);
    });

    // Initial call to set the correct fields visible
    updateFormFields();

    // --- Form Submission Logic ---
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearErrorLocal();

        const selectedType = document.querySelector('input[name="emi-type"]:checked').value;

        // Get common inputs
        const R_annual = parseFloat(rateInput.value);
        if (isNaN(R_annual) || R_annual < 0) {
            displayErrorLocal('Please enter a valid positive Annual Interest Rate.');
            return;
        }
        const r_monthly = (R_annual / 12) / 100; // Monthly rate

        let P, N_value, N_unit, EMI_val, n_months;
        let resultsHtml = '';

        try { // Use try-catch for potential calculation errors (like log(0))
            // --- Calculate based on selected type ---
            if (selectedType === 'emi') {
                P = parseFloat(loanAmountInput.value);
                N_value = parseFloat(tenureValueInput.value);
                N_unit = tenureUnitSelect.value;

                if (isNaN(P) || P <= 0) { displayErrorLocal('Please enter a valid positive Loan Amount.'); return; }
                if (isNaN(N_value) || N_value <= 0) { displayErrorLocal('Please enter a valid positive Loan Tenure.'); return; }

                n_months = (N_unit === 'years') ? N_value * 12 : N_value;
                if (n_months <= 0) { displayErrorLocal('Loan tenure must be positive.'); return; }

                if (r_monthly === 0) { // Handle 0% interest rate
                    EMI_val = P / n_months;
                } else {
                    // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
                    const numerator = P * r_monthly * Math.pow(1 + r_monthly, n_months);
                    const denominator = Math.pow(1 + r_monthly, n_months) - 1;
                    if (denominator === 0) throw new Error("Calculation error (denominator is zero).");
                    EMI_val = numerator / denominator;
                }

                const totalAmount = EMI_val * n_months;
                const totalInterest = totalAmount - P;

                resultsHtml = `
                    <h4>EMI Calculation Results:</h4>
                    <p>Monthly EMI Amount: <strong>${formatCurrencyLocal(EMI_val)}</strong></p>
                    <p>Total Principal Amount: <strong>${formatCurrencyLocal(P)}</strong></p>
                    <p>Total Interest Payable: <strong>${formatCurrencyLocal(totalInterest)}</strong></p>
                    <p>Total Amount Payable: <strong>${formatCurrencyLocal(totalAmount)}</strong></p>
                `;

            } else if (selectedType === 'loan-amount') {
                EMI_val = parseFloat(emiInput.value);
                N_value = parseFloat(tenureValueInput.value);
                N_unit = tenureUnitSelect.value;

                if (isNaN(EMI_val) || EMI_val <= 0) { displayErrorLocal('Please enter a valid positive Monthly EMI Amount.'); return; }
                if (isNaN(N_value) || N_value <= 0) { displayErrorLocal('Please enter a valid positive Loan Tenure.'); return; }

                n_months = (N_unit === 'years') ? N_value * 12 : N_value;
                 if (n_months <= 0) { displayErrorLocal('Loan tenure must be positive.'); return; }

                if (r_monthly === 0) { // Handle 0% interest rate
                    P = EMI_val * n_months;
                } else {
                    // P = EMI * ((1 + r)^n - 1) / (r * (1 + r)^n)
                    const numerator = EMI_val * (Math.pow(1 + r_monthly, n_months) - 1);
                    const denominator = r_monthly * Math.pow(1 + r_monthly, n_months);
                     if (denominator === 0) throw new Error("Calculation error (denominator is zero).");
                    P = numerator / denominator;
                }

                resultsHtml = `
                    <h4>Loan Amount Calculation Results:</h4>
                    <p>Maximum Loan Amount You Can Get: <strong>${formatCurrencyLocal(P)}</strong></p>
                     <p>For a Monthly EMI of: <strong>${formatCurrencyLocal(EMI_val)}</strong></p>
                     <p>And a Tenure of: <strong>${N_value} ${N_unit}</strong></p>
                `;

            } else if (selectedType === 'tenure') {
                P = parseFloat(loanAmountInput.value);
                EMI_val = parseFloat(emiInput.value);

                if (isNaN(P) || P <= 0) { displayErrorLocal('Please enter a valid positive Loan Amount.'); return; }
                if (isNaN(EMI_val) || EMI_val <= 0) { displayErrorLocal('Please enter a valid positive Monthly EMI Amount.'); return; }
                if (r_monthly <= 0 && EMI_val > 0) {
                    // If 0% interest, tenure is simply P / EMI
                     n_months = P / EMI_val;
                } else if (r_monthly > 0) {
                    // n = log(EMI / (EMI - P * r)) / log(1 + r)
                    const minEmi = P * r_monthly; // EMI must cover first month's interest
                    if (EMI_val <= minEmi) {
                        displayErrorLocal(`EMI must be greater than the first month's interest (${formatCurrencyLocal(minEmi + 0.01)}).`);
                        return;
                    }
                    const logNumerator = Math.log(EMI_val / (EMI_val - minEmi));
                    const logDenominator = Math.log(1 + r_monthly);

                    if (logDenominator === 0 || isNaN(logNumerator) || isNaN(logDenominator)) {
                        throw new Error("Calculation error (logarithm issue).");
                    }
                    n_months = logNumerator / logDenominator;
                 } else {
                     displayErrorLocal('Cannot calculate tenure with 0 interest and 0 EMI.');
                     return;
                 }


                if (!isFinite(n_months) || n_months < 0) {
                    displayErrorLocal('Could not calculate tenure with the provided values. Ensure EMI covers interest.');
                    return;
                }

                const totalYears = Math.floor(n_months / 12);
                const remainingMonths = Math.ceil(n_months % 12); // Use ceil for the last partial month

                let tenureString = "";
                if (totalYears > 0) {
                    tenureString += `${totalYears} year${totalYears > 1 ? 's' : ''}`;
                }
                if (remainingMonths > 0) {
                    if (totalYears > 0) tenureString += " and ";
                    tenureString += `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
                }
                 if (tenureString === "") tenureString = "Less than a month"; // Edge case

                 resultsHtml = `
                    <h4>Loan Tenure Calculation Results:</h4>
                    <p>Estimated Loan Tenure: <strong>${tenureString}</strong> (${formatCurrencyLocal(n_months)} months)</p>
                    <p>For Loan Amount: <strong>${formatCurrencyLocal(P)}</strong></p>
                    <p>And Monthly EMI: <strong>${formatCurrencyLocal(EMI_val)}</strong></p>
                `;
            }

            // Display results
            resultsDiv.innerHTML = resultsHtml;
            resultsDiv.style.display = 'block';

        } catch (error) {
            console.error("Calculation Error:", error);
            displayErrorLocal(`Calculation error: ${error.message}. Please check your inputs.`);
        }
    });
});