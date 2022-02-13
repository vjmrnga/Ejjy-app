import { call, retry, takeLatest } from 'redux-saga/effects';
import { types } from '../../ducks/OfficeManager/products';
import {
	IS_APP_LIVE,
	MAX_RETRY,
	RETRY_INTERVAL_MS,
} from '../../global/constants';
import { request } from '../../global/types';
import { ONLINE_API_URL } from '../../services';
import { service } from '../../services/OfficeManager/products';
import { getLocalIpAddress } from '../../utils/function';

function _getBaseUrl() {
	// TODO: Remove once online app is fixed.
	return IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
}

/* WORKERS */
function* list({ payload }: any) {
	const { page, pageSize, search, productCategory, ids, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.list,
			{
				page,
				page_size: pageSize,
				search,
				product_category: productCategory,
				ids,
			},
			_getBaseUrl(),
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.create, data, _getBaseUrl());

		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* edit({ payload }: any) {
	const { callback, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.edit, data, _getBaseUrl());

		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* remove({ payload }: any) {
	const { actingUserId, id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(
			service.remove,
			id,
			{ acting_user_id: actingUserId },
			_getBaseUrl(),
		);

		callback({ status: request.SUCCESS, response: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.GET_PRODUCTS, list);
};

const createWatcherSaga = function* createWatcherSaga() {
	yield takeLatest(types.CREATE_PRODUCT, create);
};

const editWatcherSaga = function* editWatcherSaga() {
	yield takeLatest(types.EDIT_PRODUCT, edit);
};

const removeWatcherSaga = function* removeWatcherSaga() {
	yield takeLatest(types.REMOVE_PRODUCT, remove);
};

export default [
	listWatcherSaga(),
	createWatcherSaga(),
	editWatcherSaga(),
	removeWatcherSaga(),
];
