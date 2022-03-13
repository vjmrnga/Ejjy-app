import { all } from 'redux-saga/effects';
import { adminSagas } from './Admin';
import authSagas from './auth';
import backOrdersSagas from './back-orders';
import branchMachinesSagas from './branch-machines';
import branchProductPendingPriceUpdatesSagas from './branch-product-pending-price-updates';
import branchProductsSagas from './branch-products';
import branchesDaysSagas from './branches-days';
import { branchManagerSagas } from './BranchManager';
import cashieringAssignmentsSagas from './cashiering-assignments';
import networkSagas from './network';
import { officeManagerSagas } from './OfficeManager';
import orderSlipsSagas from './order-slips';
import preparationSlipsSagas from './preparation-slips';
import productCategoriesSagas from './product-categories';
import productChecksSagas from './product-checks';
import requisitionSlipsSagas from './requisition-slips';
import returnItemSlipsSagas from './return-item-slips';
import sessionsSagas from './sessions';
import siteSettingsSagas from './site-settings';
import usersSagas from './users';
import xreadReportsSagas from './xread-reports';

export default function* rootSaga() {
	yield all([
		...authSagas,
		...backOrdersSagas,
		...branchMachinesSagas,
		...branchesDaysSagas,
		...branchProductsSagas,
		...branchProductPendingPriceUpdatesSagas,
		...cashieringAssignmentsSagas,
		...networkSagas,
		...orderSlipsSagas,
		...preparationSlipsSagas,
		...productCategoriesSagas,
		...productChecksSagas,
		...requisitionSlipsSagas,
		...returnItemSlipsSagas,
		...sessionsSagas,
		...siteSettingsSagas,
		...usersSagas,
		...xreadReportsSagas,
		...adminSagas,

		...officeManagerSagas,
		...branchManagerSagas,
	]);
}
