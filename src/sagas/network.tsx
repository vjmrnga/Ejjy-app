import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/network';
import { service } from '../services/network';

/* WORKERS */
function* testConnection() {
	try {
		yield call(service.test);
		yield put(actions.updateInternetConnection(true));
	} catch (e) {
		yield put(actions.updateInternetConnection(false));
	}
}

/* WATCHERS */
const testConnectionWatcherSaga = function* testConnectionWatcherSaga() {
	yield takeLatest(types.TEST_CONNECTION, testConnection);
};

export default [testConnectionWatcherSaga()];
