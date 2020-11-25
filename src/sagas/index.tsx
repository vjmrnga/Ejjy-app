import { all } from 'redux-saga/effects';
import authSagas from './auth';
import branchProductsSagas from './branch-products';
import branchesDaysSagas from './branches-days';
import { branchManagerSagas } from './BranchManager';
import { branchPersonnelSagas } from './BranchPersonnel';
import { officeManagerSagas } from './OfficeManager';
import requisitionSlipsSagas from './requisition-slips';
import sessionsSagas from './sessions';
import transactionsSagas from './transactions';

export default function* rootSaga() {
	yield all([
		...authSagas,
		...branchProductsSagas,
		...requisitionSlipsSagas,
		...branchesDaysSagas,
		...sessionsSagas,
		...transactionsSagas,
		...officeManagerSagas,
		...branchManagerSagas,
		...branchPersonnelSagas,
	]);
}
