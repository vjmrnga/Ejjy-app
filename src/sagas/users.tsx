import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/users';
import { MAX_PAGE_SIZE, request } from '../global/variables';
import { service } from '../services/users';

/* WORKERS */
function* getUsers({ payload }: any) {
	const { callback } = payload;
	callback({ status: request.REQUESTING });

	try {
		const response = yield call(service.list, {
			page: 1,
			page_size: MAX_PAGE_SIZE,
		});

		yield put(actions.save({ type: types.GET_USERS, users: response.data.results }));
		callback({ status: request.SUCCESS });
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

/* WATCHERS */
const getUsersWatcherSaga = function* getUsersWatcherSaga() {
	yield takeLatest(types.GET_USERS, getUsers);
};

export default [getUsersWatcherSaga()];
