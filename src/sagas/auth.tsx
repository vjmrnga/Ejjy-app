import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { actions, selectors, types } from '../ducks/auth';
import { AUTH_CHECKING_INTERVAL_MS, IS_LIVE_APP } from '../global/constants';
import { request } from '../global/types';
import { service } from '../services/auth';
import { LOCAL_API_URL, ONLINE_API_URL } from '../services/index';
import { isUserFromBranch } from '../utils/function';

/* WORKERS */
function* login({ payload }: any) {
	const { username, password, isFromBranch, callback } = payload;
	callback(request.REQUESTING);

	try {
		const loginBaseURL = isFromBranch ? LOCAL_API_URL : ONLINE_API_URL;

		const endpoint = IS_LIVE_APP ? service.loginOnline : service.login;
		const loginResponse = yield call(endpoint, { login: username, password }, loginBaseURL);

		if (loginResponse) {
			const user = loginResponse.data;
			const tokenBaseURL = isUserFromBranch(user.user_type) ? LOCAL_API_URL : ONLINE_API_URL;
			const tokenResponse = yield call(service.acquireToken, { username, password }, tokenBaseURL);

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
			if (id) {
				const user = yield select(selectors.selectUser());
				const baseURL = isUserFromBranch(user.user_type) ? LOCAL_API_URL : ONLINE_API_URL;
				const { data } = yield call(service.retrieve, id, { fields: 'login_count' }, baseURL);
				if (data?.login_count !== loginCount) {
					yield put(actions.logout({ id }));
					break;
				}
			} else {
				break;
			}

			yield delay(AUTH_CHECKING_INTERVAL_MS);
		}
	} catch (e) {
		console.error(e);
	}
}

function* logout({ payload }: any) {
	const { id } = payload;

	try {
		const user = yield select(selectors.selectUser());
		const baseURL = isUserFromBranch(user.user_type) ? LOCAL_API_URL : ONLINE_API_URL;
		yield call(service.logout, id, baseURL);
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

const logoutWatcherSaga = function* logoutWatcherSaga() {
	yield takeLatest(types.LOGOUT, logout);
};

export default [loginWatcherSaga(), retrieveWatcherSaga(), logoutWatcherSaga()];
