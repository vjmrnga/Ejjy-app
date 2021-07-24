import failedTransfersSagas from './failed-transfers';
import logsSagas from './logs';
import updateBranchProductBalanceSagas from './update-branch-product-balance';

export const adminSagas = [
	...logsSagas,
	...failedTransfersSagas,
	...updateBranchProductBalanceSagas,
];
