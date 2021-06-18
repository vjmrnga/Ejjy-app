import { call, put, select, takeEvery } from 'redux-saga/effects';
import { actions, types } from '../../ducks/Admin/failed-transfers';
import { selectors as branchesSelectors } from '../../ducks/OfficeManager/branches';
import { request } from '../../global/types';
import { service } from '../../services/Admin/failed-transfers';

/* WORKERS */
function* getCount({ payload }: any) {
	const { branchId, branchName, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	try {
		const response = yield call(service.getCount, baseURL);
		yield put(
			actions.save({
				type: types.GET_FAILED_TRANSFER_COUNT,
				count: response.data,
				branchId,
				branchName,
			}),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getCountWatcherSaga = function* getCountWatcherSaga() {
	yield takeEvery(types.GET_FAILED_TRANSFER_COUNT, getCount);
};

export default [getCountWatcherSaga()];
