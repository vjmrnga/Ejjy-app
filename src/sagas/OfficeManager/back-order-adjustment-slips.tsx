import { call, retry, takeEvery } from 'redux-saga/effects';
import { types } from '../../ducks/OfficeManager/back-order-adjustment-slips';
import { MAX_RETRY, RETRY_INTERVAL_MS } from '../../global/constants';
import { request } from '../../global/types';
import { ONLINE_API_URL } from '../../services/index';
import { service } from '../../services/OfficeManager/back-order-adjustment-slips';

/* WORKERS */
function* list({ payload }: any) {
	const { backOrderId, page, pageSize, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.list,
			{
				page,
				page_size: pageSize,
				back_order_id: backOrderId,
			},
			ONLINE_API_URL,
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const { backOrderId, creatingUserId, remarks, products, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(
			service.create,
			{
				back_order_id: backOrderId,
				creating_user_id: creatingUserId,
				remarks,
				back_order_adjustment_slip_products: products,
			},
			ONLINE_API_URL,
		);
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeEvery(types.LIST, list);
};

const createWatcherSaga = function* createWatcherSaga() {
	yield takeEvery(types.CREATE, create);
};

export default [listWatcherSaga(), createWatcherSaga()];
