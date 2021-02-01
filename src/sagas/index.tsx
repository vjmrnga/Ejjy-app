import { all } from 'redux-saga/effects';
import { adminSagas } from './Admin';
import authSagas from './auth';
import branchProductsSagas from './branch-products';
import branchesDaysSagas from './branches-days';
import { branchManagerSagas } from './BranchManager';
import { branchPersonnelSagas } from './BranchPersonnel';
import { officeManagerSagas } from './OfficeManager';
import requisitionSlipsSagas from './requisition-slips';
import sessionsSagas from './sessions';
import transactionsSagas from './transactions';
import xreadReportsSagas from './xread-reports';
import networkSagas from './network';

export default function* rootSaga() {
	yield all([
		...authSagas,
		...branchProductsSagas,
		...requisitionSlipsSagas,
		...branchesDaysSagas,
		...sessionsSagas,
		...networkSagas,
		...transactionsSagas,
		...xreadReportsSagas,
		...adminSagas,
		...officeManagerSagas,
		...branchManagerSagas,
		...branchPersonnelSagas,
	]);
}
