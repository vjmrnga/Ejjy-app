import { call, retry, takeLatest } from 'redux-saga/effects';
import { types } from '../ducks/back-orders';
import { IS_APP_LIVE, MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import { BackOrdersService, ONLINE_API_URL } from '../services';
import { getLocalIpAddress } from '../utils/function';
import { getBaseUrl } from './helper';

/* WORKERS */
function* list({ payload }: any) {
	const { senderBranchId, receiverId, page, pageSize, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			BackOrdersService.list,
			{
				sender_branch_id: senderBranchId,
				receiver_id: receiverId,
				page,
				page_size: pageSize,
			},
			getBaseUrl(null, callback),
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* retrieve({ payload }: any) {
	const { id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			BackOrdersService.retrieve,
			id,
			ONLINE_API_URL,
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* edit({ payload }: any) {
	const { id, receiverId, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		yield call(
			BackOrdersService.edit,
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
			BackOrdersService.receive,
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
	yield takeLatest(types.LIST, list);
};

const retrieveWatcherSaga = function* retrieveWatcherSaga() {
	yield takeLatest(types.RETRIEVE, retrieve);
};

const editWatcherSaga = function* editWatcherSaga() {
	yield takeLatest(types.EDIT, edit);
};

const receiveWatcherSaga = function* receiveWatcherSaga() {
	yield takeLatest(types.RECEIVE, receive);
};

export default [
	listWatcherSaga(),
	retrieveWatcherSaga(),
	editWatcherSaga(),
	receiveWatcherSaga(),
];
