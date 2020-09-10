import { all } from 'redux-saga/effects';
import authSagas from './auth';
import productsSagas from './products';

export default function* rootSaga() {
	yield all([...authSagas, ...productsSagas]);
}
