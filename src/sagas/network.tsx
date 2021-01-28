import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/network';
import { service } from '../services/auth';

/* WORKERS */

function* testConnection({ payload }: any) {
	const { id } = payload;

	try {
		yield call(service.retrieve, id, { fields: 'login_count' });
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
