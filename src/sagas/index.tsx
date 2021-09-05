import { all } from 'redux-saga/effects';
import { adminSagas } from './Admin';
import authSagas from './auth';
import branchProductsSagas from './branch-products';
import branchesDaysSagas from './branches-days';
import { branchManagerSagas } from './BranchManager';
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
import transactionsSagas from './transactions';
import usersSagas from './users';
import xreadReportsSagas from './xread-reports';

export default function* rootSaga() {
	yield all([
		...authSagas,
		...branchesDaysSagas,
		...branchProductsSagas,
		...networkSagas,
		...orderSlipsSagas,
		...preparationSlipsSagas,
		...productCategoriesSagas,
		...productChecksSagas,
		...requisitionSlipsSagas,
		...returnItemSlipsSagas,
		...sessionsSagas,
		...siteSettingsSagas,
		...transactionsSagas,
		...usersSagas,
		...xreadReportsSagas,
		...adminSagas,
		...officeManagerSagas,
		...branchManagerSagas,
	]);
}
