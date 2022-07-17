import { call, retry, takeEvery } from 'redux-saga/effects';
import { getOnlineApiUrl } from 'utils';
import { types } from '../../ducks/OfficeManager/return-item-slip-adjustment-slips';
import { MAX_RETRY, RETRY_INTERVAL_MS } from '../../global/constants';
import { request } from '../../global/types';
import { service } from '../../services/OfficeManager/return-item-slip-adjustment-slips';

/* WORKERS */
function* list({ payload }: any) {
	const { returnItemSlipId, page, pageSize, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.list,
			{
				page,
				page_size: pageSize,
				return_item_slip_id: returnItemSlipId,
			},
			getOnlineApiUrl(),
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const { returnItemSlipId, creatingUserId, remarks, products, callback } =
		payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(
			service.create,
			{
				return_item_slip_id: returnItemSlipId,
				creating_user_id: creatingUserId,
				remarks,
				return_item_slip_adjustment_slip_products: products,
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
