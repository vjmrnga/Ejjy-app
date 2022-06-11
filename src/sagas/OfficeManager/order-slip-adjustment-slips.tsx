import { call, retry, takeEvery } from 'redux-saga/effects';
import { types } from '../../ducks/OfficeManager/order-slip-adjustment-slips';
import { MAX_RETRY, RETRY_INTERVAL_MS } from '../../global/constants';
import { request } from '../../global/types';
import { getOnlineApiUrl } from 'utils';
import { service } from '../../services/OfficeManager/order-slip-adjustment-slips';

/* WORKERS */
function* list({ payload }: any) {
	const { orderSlipId, page, pageSize, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.list,
			{
				page,
				page_size: pageSize,
				order_slip_id: orderSlipId,
			},
			getOnlineApiUrl(),
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const { orderSlipId, creatingUserId, remarks, products, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(
			service.create,
			{
				order_slip_id: orderSlipId,
				creating_user_id: creatingUserId,
				remarks,
				order_slip_adjustment_slip_products: products,
			},
			getOnlineApiUrl(),
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
