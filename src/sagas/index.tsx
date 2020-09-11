import { all } from 'redux-saga/effects';
import authSagas from './auth';
import branchProductsSagas from './branch-products';
import branchesSagas from './branches';
import { branchManagerSagas } from './BranchManager';
import productsSagas from './products';

export default function* rootSaga() {
	yield all([
		...authSagas,
		...productsSagas,
		...branchesSagas,
		...branchProductsSagas,
		...branchManagerSagas,
	]);
}
