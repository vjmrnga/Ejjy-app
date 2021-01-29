import { call, put, select, takeLatest } from 'redux-saga/effects';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { actions, types } from '../ducks/transactions';
import { MAX_PAGE_SIZE } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/transactions';

/* WORKERS */
function* list({ payload }: any) {
	const { branch_id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		// Required: Branch must have an online URL (Requested by Office)
		const baseURL = yield select(branchesSelectors.selectURLByBranchId(branch_id));
		if (!baseURL && branch_id) {
			callback({ status: request.ERROR, errors: 'Branch has no online url.' });
			return;
		}

		const response = yield call(
			service.list,
			{
				page: 1,
				page_size: MAX_PAGE_SIZE,
			},
			baseURL,
		);

		yield put(actions.save({ type: types.LIST_TRANSACTIONS, transactions: response.data.results }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */

const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.LIST_TRANSACTIONS, list);
};

export default [listWatcherSaga()];
