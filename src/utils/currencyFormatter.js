export function formatCurrency(amount) {
    // Check if amount is a number
    if (typeof amount !== 'number') {
        return '$0.00';
    }

    // Use toFixed to round to 2 decimal places
    const formattedAmount = amount.toFixed(2);

    // Use Intl.NumberFormat to format as currency
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(formattedAmount);
}