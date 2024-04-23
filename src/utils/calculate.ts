// TODO: Remove once already implemented in backend
export const getComputedDiscount = (transactionData) => {
	return transactionData.discount_option.is_special_discount
		? Number(transactionData.overall_discount) -
				Number(transactionData.invoice.vat_amount)
		: transactionData.overall_discount;
};
