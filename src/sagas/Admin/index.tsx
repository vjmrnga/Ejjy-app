import failedTransfersSagas from './failed-transfers';
import logsSagas from './logs';
import siteSettingsSagas from './site-settings';
import updateBranchProductBalanceSagas from './update-branch-product-balance';

export const adminSagas = [
	...logsSagas,
	...failedTransfersSagas,
	...updateBranchProductBalanceSagas,
	...siteSettingsSagas,
];
