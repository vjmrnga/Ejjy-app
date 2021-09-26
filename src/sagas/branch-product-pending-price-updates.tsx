import { call, retry, select, takeLatest } from 'redux-saga/effects';
import { types } from '../ducks/branch-product-pending-price-updates';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/branch-product-pending-price-updates';

/* WORKERS */
function* list({ payload }: any) {
	const { branchId, page, pageSize, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
		return;
	}

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.list,
			{
				page,
				page_size: pageSize,
			},
			baseURL,
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* apply({ payload }: any) {
	const { id, branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	// Required: Branch must have an online URL (Requested by Office)
	const baseURL = yield select(branchesSelectors.selectURLByBranchId(branchId));
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
		return;
	}

	try {
		yield call(service.apply, id, baseURL);

		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.LIST, list);
};

const applyWatcherSaga = function* applyWatcherSaga() {
	yield takeLatest(types.APPLY, apply);
};

export default [listWatcherSaga(), applyWatcherSaga()];
