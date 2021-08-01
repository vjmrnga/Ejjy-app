import { all } from 'redux-saga/effects';
import { adminSagas } from './Admin';
import authSagas from './auth';
import branchProductsSagas from './branch-products';
import branchesDaysSagas from './branches-days';
import { branchManagerSagas } from './BranchManager';
import { branchPersonnelSagas } from './BranchPersonnel';
import networkSagas from './network';
import { officeManagerSagas } from './OfficeManager';
import orderSlipCreationSagas from './order-slip-creation';
import productCategoriesSagas from './product-categories';
import requisitionSlipsSagas from './requisition-slips';
import sessionsSagas from './sessions';
import siteSettingsSagas from './site-settings';
import transactionsSagas from './transactions';
import xreadReportsSagas from './xread-reports';

export default function* rootSaga() {
	yield all([
		...authSagas,
		...branchesDaysSagas,
		...branchProductsSagas,
		...networkSagas,
		...orderSlipCreationSagas,
		...productCategoriesSagas,
		...requisitionSlipsSagas,
		...sessionsSagas,
		...siteSettingsSagas,
		...transactionsSagas,
		...xreadReportsSagas,
		...adminSagas,
		...officeManagerSagas,
		...branchManagerSagas,
		...branchPersonnelSagas,
	]);
}
