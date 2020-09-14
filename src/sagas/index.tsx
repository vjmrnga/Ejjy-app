import { all } from 'redux-saga/effects';
import authSagas from './auth';
import branchProductsSagas from './branch-products';
import purchaseRequestsSagas from './purchase-requests';
import { branchManagerSagas } from './BranchManager';
import { officeManagerSagas } from './OfficeManager';

export default function* rootSaga() {
	yield all([
		...authSagas,
		...branchProductsSagas,
		...purchaseRequestsSagas,
		...officeManagerSagas,
		...branchManagerSagas,
	]);
}
