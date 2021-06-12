import { put, retry, select, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../../ducks/Admin/failed-transfers';
import { selectors as branchesSelectors } from '../../ducks/OfficeManager/branches';
import { MAX_RETRY, RETRY_INTERVAL_MS } from '../../global/constants';
import { request } from '../../global/types';
import { service } from '../../services/Admin/failed-transfers';

/* WORKERS */
function* getCount({ payload }: any) {
	const { branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	try {
		const response = yield retry(MAX_RETRY, RETRY_INTERVAL_MS, service.getCount, baseURL);
		yield put(
			actions.save({
				type: types.GET_FAILED_TRANSFER_COUNT,
				count: response.data,
				branchId,
			}),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getCountWatcherSaga = function* getCountWatcherSaga() {
	yield takeLatest(types.GET_FAILED_TRANSFER_COUNT, getCount);
};

export default [getCountWatcherSaga()];
