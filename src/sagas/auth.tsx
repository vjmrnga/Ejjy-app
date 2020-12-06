import { call, delay, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/auth';
import { AUTH_CHECKING_INTERVAL_MS } from '../global/constants';
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

function* retrieve({ payload }: any) {
	const { id, loginCount } = payload;

	try {
		while (true) {
			const { data } = yield call(service.retrieve, id, { fields: 'login_count' });
			if (data?.login_count !== loginCount) {
				yield put(actions.logout());
				break;
			}

			yield delay(AUTH_CHECKING_INTERVAL_MS);
		}
	} catch (e) {
		console.error(e);
	}
}

/* WATCHERS */
const loginWatcherSaga = function* loginWatcherSaga() {
	yield takeLatest(types.LOGIN, login);
};

const retrieveWatcherSaga = function* retrieveWatcherSaga() {
	yield takeLatest(types.RETRIEVE_USER, retrieve);
};

export default [loginWatcherSaga(), retrieveWatcherSaga()];
