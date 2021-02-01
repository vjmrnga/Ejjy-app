import { call, put, select, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/network';
import { selectors as authSelectors } from '../ducks/auth';
import { service } from '../services/network';

/* WORKERS */
function* testConnection() {
	try {
		const token = yield select(authSelectors.selectAccessToken());
		yield call(service.test, { token });
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
