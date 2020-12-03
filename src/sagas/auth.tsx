import { call, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/auth';
import { request } from '../global/types';
import { service } from '../services/auth';

/* WORKERS */
function* login({ payload }: any) {
	const { username, password, callback } = payload;
	callback(request.REQUESTING);

	try {
		const loginResponse = yield call(service.login, {
			login: username,
			password,
		});

		if (loginResponse) {
			const tokenResponse = yield call(service.acquireToken, {
				username,
				password,
			});

			yield put(
				actions.save({
					user: loginResponse.data,
					accessToken: tokenResponse.data.access,
					refreshToken: tokenResponse.data.refresh,
				}),
			);

			callback(request.SUCCESS);
		} else {
			callback(request.ERROR, ['Username or password is invalid.']);
		}
	} catch (e) {
		callback(request.ERROR, e.errors);
	}
}

/* WATCHERS */
const loginWatcherSaga = function* loginWatcherSaga() {
	yield takeLatest(types.LOGIN, login);
};

export default [loginWatcherSaga()];
