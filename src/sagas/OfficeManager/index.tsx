import branchesSagas from './branches';
import productsSagas from './products';
import orderSlipsSagas from './order-slips';

export const officeManagerSagas = [...branchesSagas, ...productsSagas, ...orderSlipsSagas];
