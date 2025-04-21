// js/sip-calculator.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sip-calculator-form');
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error-message');
    const calculatorTypeRadios = document.querySelectorAll('input[name="sip-type"]');

    // Input field groups
    const groupMonthlyInvestment = document.getElementById('group-monthly-investment');
    const groupRate = document.getElementById('group-rate');
    const groupTenure = document.getElementById('group-tenure');
    const groupTargetAmount = document.getElementById('group-target-amount');

    // Input fields
    const monthlyInvestmentInput = document.getElementById('monthly-investment');
    const rateInput = document.getElementById('rate');
    const tenureInput = document.getElementById('tenure');
    const targetAmountInput = document.getElementById('target-amount');

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
        const selectedType = document.querySelector('input[name="sip-type"]:checked').value;

        // Hide all initially
        groupMonthlyInvestment.style.display = 'none';
        groupRate.style.display = 'none';
        groupTenure.style.display = 'none';
        groupTargetAmount.style.display = 'none';

        // Show based on selection (Rate and Tenure always needed for these two types)
        groupRate.style.display = 'block';
        groupTenure.style.display = 'block';

        if (selectedType === 'maturity') {
            groupMonthlyInvestment.style.display = 'block';
        } else if (selectedType === 'sip-amount') {
            groupTargetAmount.style.display = 'block';
        }

        // Clear inputs and results when type changes
        monthlyInvestmentInput.value = '';
        rateInput.value = '';
        tenureInput.value = '';
        targetAmountInput.value = '';
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

        const selectedType = document.querySelector('input[name="sip-type"]:checked').value;

        // Get common inputs
        const R_annual = parseFloat(rateInput.value);
        const T_years = parseFloat(tenureInput.value);

        if (isNaN(R_annual) || R_annual < 0) {
            displayErrorLocal('Please enter a valid positive Expected Annual Rate of Return.');
            return;
        }
         if (isNaN(T_years) || T_years <= 0) {
            displayErrorLocal('Please enter a valid positive Investment Tenure in years.');
            return;
        }

        const n_months = T_years * 12;
        const i_monthly = (R_annual / 12) / 100; // Monthly rate

        let S, M; // S = Monthly SIP, M = Maturity Amount
        let resultsHtml = '';

        try {
            // --- Calculate based on selected type ---
            if (selectedType === 'maturity') {
                S = parseFloat(monthlyInvestmentInput.value);
                if (isNaN(S) || S <= 0) {
                    displayErrorLocal('Please enter a valid positive Monthly Investment Amount.');
                    return;
                }

                // Future Value of Annuity Formula: M = S * [((1 + i)^n - 1) / i] * (1 + i) --- This formula includes the last month's interest
                // More common formula: M = S * [((1 + i)^n - 1) / i] --- This assumes payment at end of period. We'll use this one for simplicity.
                // Let's stick to the standard one assuming payment at start: M = S * (((1 + i)^n - 1) / i) * (1 + i)
                // Let's use the simpler one (payment at end) M = S * [((1 + i)^n - 1) / i] as it matches many online calculators. Revisit if needed.
                let M_calc;
                if (i_monthly === 0) { // Handle 0% interest rate
                    M_calc = S * n_months;
                } else {
                    M_calc = S * ( (Math.pow(1 + i_monthly, n_months) - 1) / i_monthly );
                }


                const totalInvested = S * n_months;
                const estimatedReturns = M_calc - totalInvested;

                resultsHtml = `
                    <h4>SIP Maturity Calculation Results:</h4>
                    <p>Monthly Investment (SIP): <strong>${formatCurrencyLocal(S)}</strong></p>
                    <p>Total Amount Invested: <strong>${formatCurrencyLocal(totalInvested)}</strong></p>
                    <p>Estimated Returns: <strong>${formatCurrencyLocal(estimatedReturns)}</strong></p>
                    <p>Total Maturity Value: <strong>${formatCurrencyLocal(M_calc)}</strong></p>
                    <hr>
                    <p><small>Calculated for ${T_years} years at an expected annual return of ${R_annual}%. Assumes investment at the end of each month.</small></p>
                `;

            } else if (selectedType === 'sip-amount') {
                M = parseFloat(targetAmountInput.value);
                 if (isNaN(M) || M <= 0) {
                    displayErrorLocal('Please enter a valid positive Target Maturity Amount.');
                    return;
                }

                // Rearranged formula: S = M / [((1 + i)^n - 1) / i]
                 let S_calc;
                if (i_monthly === 0) { // Handle 0% interest rate
                     if (n_months === 0) throw new Error("Tenure cannot be zero for 0% interest.");
                     S_calc = M / n_months;
                } else {
                    const factor = (Math.pow(1 + i_monthly, n_months) - 1) / i_monthly;
                    if (factor === 0) throw new Error("Calculation error (division by zero factor).");
                     S_calc = M / factor;
                }

                 resultsHtml = `
                    <h4>Required SIP Amount Calculation Results:</h4>
                    <p>Target Maturity Amount: <strong>${formatCurrencyLocal(M)}</strong></p>
                    <p>Required Monthly Investment (SIP): <strong>${formatCurrencyLocal(S_calc)}</strong></p>
                    <hr>
                     <p><small>To achieve the target in ${T_years} years with an expected annual return of ${R_annual}%. Assumes investment at the end of each month.</small></p>
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