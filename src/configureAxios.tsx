import axios from 'axios';
import { flatten, values } from 'lodash';
import { actions as authActions, key as AUTH_KEY } from './ducks/auth';
import { API_TIMEOUT, API_URL, NO_VERIFICATION_NEEDED } from './global/variables';

const VERIFY_ACCESS_TOKEN_URL = `${API_URL}/tokens/access/verify/`;
const VERIFY_REFRESH_TOKEN_URL = `${API_URL}/tokens/refresh/verify/`;
const RENEW_ACCESS_TOKEN_URL = `${API_URL}/tokens/renew/`;

export default function configureAxios(store: any) {
	axios.defaults.baseURL = API_URL;
	axios.defaults.timeout = API_TIMEOUT;

	// add a request interceptor to all the axios requests
	// that are going to be made in the site. The purpose
	// of this interceptor is to verify if the access token
	// is still valid and renew it if needed and possible
	axios.interceptors.request.use(
		// eslint-disable-next-line func-names
		function (config) {
			// if there's no verification needed, just exit immediately
			if (NO_VERIFICATION_NEEDED === config.params) {
				return config;
			}

			// since there's no `connect` HOC, this is how we
			// access the store (or reducer)
			const state = store.getState();
			const { accessToken, refreshToken } = state[AUTH_KEY];

			// we need to check if the access token is still valid. For this case,
			// so as to prevent forever loop, we're going to use the native `fetch`
			// method to do the request. Otherwise, if we use `axios` it will be
			// intercepted again by this interceptor
			fetch(`${VERIFY_ACCESS_TOKEN_URL}?token=${accessToken}`, {
				method: 'GET',
			})
				.then((res) => res.json())
				.then((tokenStatus) => {
					if (!tokenStatus) {
						// access token has already expired, so try to
						// see if refresh token is still active
						return fetch(`${VERIFY_REFRESH_TOKEN_URL}?token=${refreshToken}`);
					}

					// if the access token is still active, just throw an error immediately
					// to immediately exit this Promise chain
					throw new Error('Access token is still active');
				})
				.then((res) => res.json())
				.then((tokenStatus) => {
					if (!tokenStatus) {
						// if the refresh token has already expired as well, logout the user
						// and throw an error to exit this Promise chain
						store.dispatch(authActions.loginReset());
						throw new Error('Refresh token has already expired');
					}

					// if the refresh token is still active, renew the access token using it
					return fetch(`${RENEW_ACCESS_TOKEN_URL}?token=${refreshToken}`);
				})
				.then((res) => res.json())
				.then((newToken) => {
					console.log('newToken', newToken);
					// store the new access token to the reducer
					// store.dispatch(actions.loginRenewAccessToken(newToken)); TODO:
				})
				.catch(() => {
					// just do nothing
				});

			return config;
		},
		function (error) {
			return Promise.reject(error);
		},
	);

	axios.interceptors.response.use(
		(config) => config,
		(error) => {
			const modifiedError = { ...error };

			if (error.isAxiosError) {
				if (typeof error.response.data === 'string') {
					modifiedError.errors = [error.response.data];
				} else {
					modifiedError.errors = flatten(values(error.response.data));
				}
			}

			return Promise.reject(modifiedError);
		},
	);
}
