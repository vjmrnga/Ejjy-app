export const calculateCashBreakdownTotal = (cashBreakdown) =>
	0.25 * cashBreakdown.coins_25 +
	1 * cashBreakdown.coins_1 +
	5 * cashBreakdown.coins_5 +
	10 * cashBreakdown.coins_10 +
	20 * cashBreakdown.coins_20 +
	20 * cashBreakdown.bills_20 +
	50 * cashBreakdown.bills_50 +
	100 * cashBreakdown.bills_100 +
	200 * cashBreakdown.bills_200 +
	500 * cashBreakdown.bills_500 +
	1000 * cashBreakdown.bills_1000;

// TODO: Remove once already implemented in backend
export const getComputedDiscount = (transactionData) => {
	return transactionData.discount_option.is_special_discount
		? Number(transactionData.overall_discount) -
				Number(transactionData.invoice.vat_amount)
		: transactionData.overall_discount;
};
