import { all } from 'redux-saga/effects';
import { adminSagas } from './Admin';
import authSagas from './auth';
import backOrdersSagas from './back-orders';
import branchProductPendingPriceUpdatesSagas from './branch-product-pending-price-updates';
import branchProductsSagas from './branch-products';
import branchesDaysSagas from './branches-days';
import { branchManagerSagas } from './BranchManager';
import { officeManagerSagas } from './OfficeManager';
import orderSlipsSagas from './order-slips';
import preparationSlipsSagas from './preparation-slips';
import requisitionSlipsSagas from './requisition-slips';
import returnItemSlipsSagas from './return-item-slips';
import usersSagas from './users';

export default function* rootSaga() {
	yield all([
		...authSagas,
		...backOrdersSagas,
		...branchesDaysSagas,
		...branchProductsSagas,
		...branchProductPendingPriceUpdatesSagas,
		...orderSlipsSagas,
		...preparationSlipsSagas,
		...requisitionSlipsSagas,
		...returnItemSlipsSagas,
		...usersSagas,
		...adminSagas,
		...officeManagerSagas,
		...branchManagerSagas,
	]);
}
