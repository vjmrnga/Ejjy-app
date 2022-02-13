import { call, retry, takeLatest } from 'redux-saga/effects';
import { types } from '../ducks/site-settings';
import { MAX_RETRY, RETRY_INTERVAL_MS } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/site-settings';
import { getBaseUrl } from './helper';

/* WORKERS */
function* get({ payload }: any) {
	const { branchId, callback } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = getBaseUrl(branchId, callback);

	try {
		const response = yield retry(
			MAX_RETRY,
			RETRY_INTERVAL_MS,
			service.get,
			baseURL,
		);

		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* edit({ payload }: any) {
	const { branchId, callback, id, ...data } = payload;
	callback({ status: request.REQUESTING });

	const baseURL = getBaseUrl(branchId, callback);

	try {
		const response = yield call(service.edit, id, data, baseURL);
		callback({ status: request.SUCCESS, data: response.data });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getWatcherSaga = function* getWatcherSaga() {
	yield takeLatest(types.GET_SITE_SETTINGS, get);
};

const editWatcherSaga = function* editWatcherSaga() {
	yield takeLatest(types.EDIT_SITE_SETTINGS, edit);
};

export default [getWatcherSaga(), editWatcherSaga()];
