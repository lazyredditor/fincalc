// js/mortgage-calculator.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mortgage-calculator-form');
    const resultsDiv = document.getElementById('results');
    const errorDiv = document.getElementById('error-message');
    const amortizationDetailsDiv = document.getElementById('amortization-details');
    const scheduleBody = document.getElementById('schedule-body');

    // Input fields
    const loanAmountInput = document.getElementById('loan-amount');
    const rateInput = document.getElementById('rate');
    const tenureInput = document.getElementById('tenure');
    const extraMonthlyInput = document.getElementById('extra-monthly');
    const extraOneTimeAmountInput = document.getElementById('extra-one-time-amount');
    const extraOneTimeMonthInput = document.getElementById('extra-one-time-month');


    // --- Helper functions ---
    const formatCurrencyLocal = (value) => {
        if (isNaN(value) || !isFinite(value)) return 'N/A';
        // Ensure negative signs are handled correctly if needed, though not typical here
        return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
     const displayErrorLocal = (message) => {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        resultsDiv.style.display = 'none';
        amortizationDetailsDiv.style.display = 'none'; // Hide results on error
    };
    const clearErrorLocal = () => {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    };
    // --- End Helpers ---

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearErrorLocal();
        resultsDiv.style.display = 'none'; // Hide previous results
        amortizationDetailsDiv.style.display = 'none'; // Hide previous schedule
        scheduleBody.innerHTML = ''; // Clear previous schedule body

        // --- Get Input Values ---
        const P = parseFloat(loanAmountInput.value);
        const R_annual = parseFloat(rateInput.value);
        const T_years = parseInt(tenureInput.value);
        const extra_monthly = parseFloat(extraMonthlyInput.value) || 0; // Default to 0 if empty/NaN
        const extra_one_time_amount = parseFloat(extraOneTimeAmountInput.value) || 0;
        const extra_one_time_month = parseInt(extraOneTimeMonthInput.value) || 0; // Month number (1-based)

        // --- Input Validation ---
        if (isNaN(P) || P <= 0) { displayErrorLocal('Please enter a valid positive Loan Amount.'); return; }
        if (isNaN(R_annual) || R_annual < 0) { displayErrorLocal('Please enter a valid positive Annual Interest Rate.'); return; }
        if (isNaN(T_years) || T_years <= 0) { displayErrorLocal('Please enter a valid positive Loan Tenure in years.'); return; }
        if (isNaN(extra_monthly) || extra_monthly < 0) { displayErrorLocal('Please enter a valid non-negative Extra Monthly Payment.'); return; }
        if (isNaN(extra_one_time_amount) || extra_one_time_amount < 0) { displayErrorLocal('Please enter a valid non-negative One-Time Extra Payment Amount.'); return; }
        if (isNaN(extra_one_time_month) || (extra_one_time_amount > 0 && extra_one_time_month <= 0) ) { displayErrorLocal('Please enter a valid positive Month Number for the one-time payment if amount is specified.'); return; }

        // --- Core Calculations ---
        const r_monthly = (R_annual / 12) / 100;
        const n_months_original = T_years * 12;

        // Calculate Standard Monthly Payment (Principal & Interest)
        let monthly_payment;
        if (r_monthly === 0) {
            monthly_payment = P / n_months_original;
        } else {
             const numerator = P * r_monthly * Math.pow(1 + r_monthly, n_months_original);
             const denominator = Math.pow(1 + r_monthly, n_months_original) - 1;
             if (denominator === 0) { displayErrorLocal("Calculation error: Cannot calculate standard payment."); return; }
             monthly_payment = numerator / denominator;
        }


        // --- Amortization Calculation ---
        let remaining_balance = P;
        let total_interest_paid = 0;
        let total_extra_paid = 0;
        let current_month = 0;
        const schedule_data = []; // Array to hold row data

        while (remaining_balance > 0 && current_month < n_months_original * 2) { // Add safety break
            current_month++;

            const interest_for_month = remaining_balance * r_monthly;
            let principal_paid = monthly_payment - interest_for_month;
            let current_extra_payment = extra_monthly;

            // Apply one-time extra payment
            if (current_month === extra_one_time_month) {
                 current_extra_payment += extra_one_time_amount;
            }

            // Adjust principal if payment exceeds balance
            if (remaining_balance + interest_for_month <= monthly_payment + current_extra_payment) {
                principal_paid = remaining_balance;
                 // Adjust the actual payment made in the last month
                 const final_payment = remaining_balance + interest_for_month;
                 current_extra_payment = Math.max(0, final_payment - principal_paid - interest_for_month); // The extra part of the final payment
                 monthly_payment = final_payment - current_extra_payment; // The standard part of the final payment
                 remaining_balance = 0;
            } else {
                remaining_balance -= principal_paid;
                remaining_balance -= current_extra_payment;
                 // Ensure balance doesn't go negative due to floating point issues slightly overpaying extra
                 if (remaining_balance < 0) remaining_balance = 0;
            }

            total_interest_paid += interest_for_month;
            total_extra_paid += current_extra_payment;


            schedule_data.push({
                month: current_month,
                payment: monthly_payment + current_extra_payment, // Total outflow this month
                principal: principal_paid,
                interest: interest_for_month,
                extra: current_extra_payment,
                balance: remaining_balance
            });

            // Safety break if something goes wrong
             if (current_month >= n_months_original * 2) {
                 console.error("Exceeded maximum expected months. Aborting calculation.");
                 displayErrorLocal("Calculation error. Could not determine payoff.");
                 return;
             }
        }

        // --- Post-Calculation Analysis ---
        const actual_months_paid = current_month;
        const years_saved = Math.floor((n_months_original - actual_months_paid) / 12);
        const months_saved = (n_months_original - actual_months_paid) % 12;

        // Calculate total interest without extra payments
        const total_paid_standard = monthly_payment * n_months_original;
        const total_interest_standard = total_paid_standard - P;
        const total_interest_saved = total_interest_standard - total_interest_paid;


        // --- Display Summary Results ---
        let resultsHtml = `
            <h4>Mortgage Summary:</h4>
            <p>Monthly Payment (Principal & Interest): <strong>${formatCurrencyLocal(monthly_payment)}</strong></p>
            <p>Total Payments Made: <strong>${actual_months_paid}</strong></p>
            <p>Total Principal Paid: <strong>${formatCurrencyLocal(P)}</strong></p>
            <p>Total Interest Paid: <strong>${formatCurrencyLocal(total_interest_paid)}</strong></p>
        `;

        if (total_extra_paid > 0) {
             resultsHtml += `
                <hr>
                <p>Total Extra Payments Made: <strong>${formatCurrencyLocal(total_extra_paid)}</strong></p>
                <p>Time Saved: <strong>${years_saved} years and ${months_saved} months</strong></p>
                <p>Total Interest Saved: <strong>${formatCurrencyLocal(total_interest_saved)}</strong></p>
            `;
        }
         resultsHtml += `<hr><p><small>Based on ${T_years} year term at ${R_annual}% annual interest.</small></p>`;

        resultsDiv.innerHTML = resultsHtml;
        resultsDiv.style.display = 'block';

        // --- Populate Amortization Table ---
        schedule_data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.month}</td>
                <td>${formatCurrencyLocal(row.payment)}</td>
                <td>${formatCurrencyLocal(row.principal)}</td>
                <td>${formatCurrencyLocal(row.interest)}</td>
                <td>${formatCurrencyLocal(row.extra)}</td>
                <td>${formatCurrencyLocal(row.balance)}</td>
            `;
            scheduleBody.appendChild(tr);
        });
        amortizationDetailsDiv.style.display = 'block';

    });
});