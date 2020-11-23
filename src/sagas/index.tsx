import { all } from 'redux-saga/effects';
import authSagas from './auth';
import branchProductsSagas from './branch-products';
import { branchManagerSagas } from './BranchManager';
import { branchPersonnelSagas } from './BranchPersonnel';
import { officeManagerSagas } from './OfficeManager';
import requisitionSlipsSagas from './requisition-slips';
import branchesDaysSagas from './branches-days';

export default function* rootSaga() {
	yield all([
		...authSagas,
		...branchProductsSagas,
		...requisitionSlipsSagas,
		...branchesDaysSagas,
		...officeManagerSagas,
		...branchManagerSagas,
		...branchPersonnelSagas,
	]);
}
