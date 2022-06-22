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
