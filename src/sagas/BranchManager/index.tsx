import preparationSlipsSagas from './delivery-receipts';
import localBranchSettingsSagas from './local-branch-settings';

export const branchManagerSagas = [
	...preparationSlipsSagas,
	...localBranchSettingsSagas,
];
