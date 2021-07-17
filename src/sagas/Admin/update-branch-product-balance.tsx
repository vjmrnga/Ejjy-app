import { call, takeEvery } from 'redux-saga/effects';
import { types } from '../../ducks/Admin/update-branch-product-balance';
import { request } from '../../global/types';
import { ONLINE_API_URL } from '../../services';
import { service } from '../../services/Admin/update-branch-product-balance';

/* WORKERS */
function* getCount({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.getCount, ONLINE_API_URL);
		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getCountWatcherSaga = function* getCountWatcherSaga() {
	yield takeEvery(types.GET_UPDATE_BRANCH_PRODUCT_BALANCE_LOGS, getCount);
};

export default [getCountWatcherSaga()];
