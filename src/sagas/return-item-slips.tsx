import { call, retry, takeLatest } from 'redux-saga/effects';
import { types } from '../ducks/return-item-slips';
import { IS_APP_LIVE, MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import { ONLINE_API_URL } from '../services';
import { service } from '../services/return-item-slips';
import { getLocalIpAddress } from '../utils/function';

/* WORKERS */
function* list({ payload }: any) {
	const { senderBranchId, receiverId, page, pageSize, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.list,
			{
				sender_branch_id: senderBranchId,
				receiver_id: receiverId,
				page,
				page_size: pageSize,
			},
			ONLINE_API_URL,
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const { senderId, products, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(
			service.create,
			{
				sender_id: senderId,
				is_online: IS_APP_LIVE,
				products,
			},
			IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
		);

		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* edit({ payload }: any) {
	const { id, receiverId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(
			service.edit,
			id,
			{
				receiver_id: receiverId,
			},
			IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
		);

		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* receive({ payload }: any) {
	const { id, products, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(
			service.receive,
			id,
			{
				is_online: IS_APP_LIVE,
				products,
			},
			IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
		);

		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.GET_RETURN_ITEM_SLIPS, list);
};

const createWatcherSaga = function* createWatcherSaga() {
	yield takeLatest(types.CREATE_RETURN_ITEM_SLIP, create);
};

const editWatcherSaga = function* editWatcherSaga() {
	yield takeLatest(types.EDIT_RETURN_ITEM_SLIP, edit);
};

const receiveWatcherSaga = function* receiveWatcherSaga() {
	yield takeLatest(types.RECEIVE_RETURN_ITEM_SLIP, receive);
};

export default [
	listWatcherSaga(),
	createWatcherSaga(),
	editWatcherSaga(),
	receiveWatcherSaga(),
];