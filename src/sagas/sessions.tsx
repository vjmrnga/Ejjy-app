import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/sessions';
import { MAX_PAGE_SIZE } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/sessions';

/* WORKERS */
function* list({ payload }: any) {
	const { branch_id, callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
			branch_id,
		});

		yield put(actions.save({ type: types.LIST_SESSIONS, sessions: response.data.results }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const listWatcherSaga = function* listWatcherSaga() {
	yield takeLatest(types.LIST_SESSIONS, list);
};

export default [listWatcherSaga()];
