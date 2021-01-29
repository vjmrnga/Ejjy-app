import { call, put, retry, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../../ducks/Admin/site-settings';
import { MAX_RETRY, RETRY_INTERVAL_MS } from '../../global/constants';
import { request } from '../../global/types';
import { service } from '../../services/Admin/site-settings';
import { ONLINE_API_URL } from '../../services/index';

/* WORKERS */
function* get({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield retry(MAX_RETRY, RETRY_INTERVAL_MS, service.get, ONLINE_API_URL);
		yield put(actions.save({ type: types.GET_SITE_SETTINGS, siteSettings: response.data }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* edit({ payload }: any) {
	const { callback, id, ...data } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.edit, id, data, ONLINE_API_URL);
		yield put(actions.save({ type: types.EDIT_SITE_SETTINGS, siteSettings: response.data }));
		callback({ status: request.SUCCESS });
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
