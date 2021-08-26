import { call, put, select, takeEvery } from 'redux-saga/effects';
import { actions, types } from '../ducks/network';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { request } from '../global/types';
import { ONLINE_API_URL } from '../services';
import { service } from '../services/network';

/* WORKERS */
function* testConnection() {
	try {
		yield call(service.test, ONLINE_API_URL);
		yield put(actions.updateInternetConnection(true));
	} catch (e) {
		yield put(actions.updateInternetConnection(false));
	}
}

function* testBranchConnection({ payload }: any) {
	const { branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR });
		return;
	}

	try {
		yield call(service.test, baseURL);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR });
	}
}

/* WATCHERS */
const testConnectionWatcherSaga = function* testConnectionWatcherSaga() {
	yield takeEvery(types.TEST_CONNECTION, testConnection);
};

const testBranchConnectionWatcherSaga =
	function* testBranchConnectionWatcherSaga() {
		yield takeEvery(types.TEST_BRANCH_CONNECTION, testBranchConnection);
	};

export default [testConnectionWatcherSaga(), testBranchConnectionWatcherSaga()];
