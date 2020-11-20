import preparationSlipsSagas from './delivery-receipts';
import productChecksSagas from './product-checks';
import branchesDaysSagas from './branches-days';

export const branchManagerSagas = [
	...preparationSlipsSagas,
	...productChecksSagas,
	...branchesDaysSagas,
];
