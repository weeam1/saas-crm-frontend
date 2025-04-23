function calculateTotal(unitPrice, commissionPercentage, vatPercentage) {
    const commission = (commissionPercentage / 100) * unitPrice;

    const vatAmount = (vatPercentage / 100) * unitPrice;=
    const totalAmount = unitPrice + commission + vatAmount;

    return {
        unitPrice: unitPrice,
        commission: commission,
        vatAmount: vatAmount,
        totalAmount: totalAmount
    };
}
