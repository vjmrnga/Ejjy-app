import branchesSagas from './branches';
import productsSagas from './products';
import orderSlipsSagas from '../order-slips';
import preparationSlipsSagas from './delivery-receipts';

export const officeManagerSagas = [
	...branchesSagas,
	...productsSagas,
	...orderSlipsSagas,
	...preparationSlipsSagas,
];
