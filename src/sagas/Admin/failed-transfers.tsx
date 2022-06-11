import { call, put, select, takeEvery } from 'redux-saga/effects';
import { actions, types } from '../../ducks/Admin/failed-transfers';
import { selectors as branchesSelectors } from '../../ducks/OfficeManager/branches';
import { request } from '../../global/types';
import { getOnlineApiUrl } from 'utils';
import { service } from '../../services/Admin/failed-transfers';

/* WORKERS */
function* getCount({ payload }: any) {
	// No callback is used in this endpoint as request status is not needed.
	const { branchId, branchName, callback } = payload;

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	try {
		const response = yield call(service.getCount, baseURL || getOnlineApiUrl());
		yield put(
			actions.save({
				type: types.GET_FAILED_TRANSFER_COUNT,
				count: response.data,
				branchId,
				branchName,
			}),
		);
		// eslint-disable-next-line no-empty
	} catch (e) {}
}

/* WATCHERS */
const getCountWatcherSaga = function* getCountWatcherSaga() {
	yield takeEvery(types.GET_FAILED_TRANSFER_COUNT, getCount);
};

export default [getCountWatcherSaga()];
