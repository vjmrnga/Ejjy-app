import { call, retry, select, takeLatest } from 'redux-saga/effects';
import { types } from '../ducks/product-categories';
import {
	IS_APP_LIVE,
	MAX_PAGE_SIZE,
	MAX_RETRY,
	RETRY_INTERVAL_MS,
} from '../global/constants';
import { request } from '../global/types';
import { ONLINE_API_URL } from '../services/index';
import { service } from '../services/product-categories';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { getLocalIpAddress } from '../utils/function';

function _getBaseUrl(branchId, callback) {
	let baseURL: any = branchesSelectors.selectURLByBranchId(branchId);
	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
	} else {
		baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
	}

	return baseURL;
}

/* WORKERS */
function* list({ payload }: any) {
	const { branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = _getBaseUrl(branchId, callback);

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.list,
			{
				page: 1,
				page_size: MAX_PAGE_SIZE,
			},
			baseURL,
		);

		const sortedData = response.data.results.sort(
			(a, b) => a.priority_level - b.priority_level,
		);

		callback({ status: request.SUCCESS, data: sortedData });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* create({ payload }: any) {
	const { callback, branchId, ...data } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = _getBaseUrl(branchId, callback);

	try {
		const response = yield call(service.create, data, baseURL);
		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* edit({ payload }: any) {
	const { callback, branchId, ...data } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = _getBaseUrl(branchId, callback);

	try {
		const response = yield call(service.edit, data, baseURL);
		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* remove({ payload }: any) {
	const { callback, id, branchId } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = _getBaseUrl(branchId, callback);

	try {
		const response = yield call(service.remove, id, baseURL);
		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.GET_PRODUCT_CATEGORIES, list);
};

const createWatcherSaga = function* createWatcherSaga() {
	yield takeLatest(types.CREATE_PRODUCT_CATEGORY, create);
};

const editWatcherSaga = function* editWatcherSaga() {
	yield takeLatest(types.EDIT_PRODUCT_CATEGORY, edit);
};

const removeWatcherSaga = function* removeWatcherSaga() {
	yield takeLatest(types.REMOVE_PRODUCT_CATEGORY, remove);
};

export default [
	listWatcherSaga(),
	createWatcherSaga(),
	editWatcherSaga(),
	removeWatcherSaga(),
];
