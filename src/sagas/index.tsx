import { all } from 'redux-saga/effects';
import authSagas from './auth';
import productsSagas from './products';
import branchesSagas from './branches';
import branchProductsSagas from './branch-products';

export default function* rootSaga() {
	yield all([...authSagas, ...productsSagas, ...branchesSagas, ...branchProductsSagas]);
}
