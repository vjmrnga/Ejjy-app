/* eslint-disable no-console */
import { call, delay, put, takeLatest } from 'redux-saga/effects';
import { actions, types } from '../ducks/auth';
import { AUTH_CHECKING_INTERVAL_MS, IS_APP_LIVE } from '../global/constants';
import { request, userTypes } from '../global/types';
import { service } from '../services/auth';
import { getOnlineApiUrl } from 'utils';
import { getLocalApiUrl } from 'utils';

/* WORKERS */
function* login({ payload }: any) {
	const { username, password, callback } = payload;
	callback({ status: request.REQUESTING });

	const localURL = getLocalApiUrl();

	try {
		const loginBaseURL = IS_APP_LIVE ? getOnlineApiUrl() : localURL;
		const endpoint = IS_APP_LIVE ? service.loginOnline : service.login;
		const loginResponse = yield call(
			endpoint,
			{ login: username, password },
			loginBaseURL,
		);

		if (
			[userTypes.ADMIN, userTypes.OFFICE_MANAGER].includes(
				loginResponse?.data?.user_type,
			) &&
			!IS_APP_LIVE
		) {
			callback({
				status: request.ERROR,
				errors: ['Only branch manager and personnels can use the local app.'],
			});
			return;
		}

		if (loginResponse) {
			// let tokenBaseURL = IS_APP_LIVE ? getOnlineApiUrl() : localURL;
			// const tokenResponse = yield call(
			// 	service.acquireToken,
			// 	{ username, password },
			// 	tokenBaseURL,
			// );

			yield put(
				actions.save({
					user: loginResponse.data,
					// accessToken: tokenResponse.data.access,
					// refreshToken: tokenResponse.data.refresh,
				}),
			);

			callback({ status: request.SUCCESS });
		} else {
			callback({
				status: request.ERROR,
				errors: ['Username or password is invalid.'],
			});
		}
	} catch (e) {
		callback({ status: request.ERROR, errors: e.errors });
	}
}

function* retrieve({ payload }: any) {
	const { id, loginCount } = payload;

	const localURL = getLocalApiUrl();

	try {
		while (true) {
			if (id) {
				const baseURL = IS_APP_LIVE ? getOnlineApiUrl() : localURL;
				const endpoint = IS_APP_LIVE
					? service.retrieveOnline
					: service.retrieve;
				const { data } = yield call(endpoint, id, {}, baseURL);

				const newLoginCount = IS_APP_LIVE
					? data.online_login_count
					: data.login_count;
				if (newLoginCount !== loginCount) {
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

	const localURL = getLocalApiUrl();

	try {
		if (id) {
			const baseURL = IS_APP_LIVE ? getOnlineApiUrl() : localURL;
			const endpoint = IS_APP_LIVE ? service.logoutOnline : service.login;
			yield call(endpoint, id, baseURL);
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

const logoutWatcherSaga = function* logoutWatcherSaga() {
	yield takeLatest(types.LOGOUT, logout);
};

export default [loginWatcherSaga(), retrieveWatcherSaga(), logoutWatcherSaga()];
