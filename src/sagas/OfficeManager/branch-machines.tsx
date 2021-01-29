import { put, retry, select, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../../ducks/OfficeManager/branch-machines';
import { selectors as branchesSelectors } from '../../ducks/OfficeManager/branches';
import { MAX_PAGE_SIZE, MAX_RETRY, RETRY_INTERVAL_MS } from '../../global/constants';
import { request } from '../../global/types';
import { LOCAL_API_URL } from '../../services';
import { service } from '../../services/OfficeManager/branch-machines';

/* WORKERS */
function* list({ payload }: any) {
	const { branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: 'Branch has no online url.' });
		return;
	}

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.list,
			{
				page: 1,
				page_size: MAX_PAGE_SIZE,
			},
			baseURL || LOCAL_API_URL,
		);

		yield put(
			actions.save({ type: types.GET_BRANCH_MACHINES, branchMachines: response.data.results }),
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.GET_BRANCH_MACHINES, list);
};

export default [listWatcherSaga()];
