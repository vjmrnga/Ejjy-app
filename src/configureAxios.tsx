import axios from 'axios';
import { flatten, values } from 'lodash';
import {
	GENERIC_BRANCH_ERROR_MESSAGE,
	GENERIC_ERROR_MESSAGE,
} from './global/constants';
import { API_TIMEOUT, ONLINE_API_URL } from './services';

export default function configureAxios() {
	axios.defaults.timeout = API_TIMEOUT;

	axios.interceptors.request.use(
		(config) => config,
		(error) => Promise.reject(error),
	);

	axios.interceptors.response.use(null, (error) => {
		const modifiedError = { ...error };

		if (error.isAxiosError) {
			if (typeof error?.response?.data === 'string') {
				modifiedError.errors = [error.response.data];
			} else if (typeof error?.response?.data === 'object') {
				modifiedError.errors = flatten(values(error?.response?.data));
			} else if (
				error?.config.baseURL !== ONLINE_API_URL &&
				error?.isAxiosError
			) {
				modifiedError.errors = [GENERIC_BRANCH_ERROR_MESSAGE];
			} else {
				modifiedError.errors = [GENERIC_ERROR_MESSAGE];
			}
		}

		return Promise.reject(modifiedError);
	});
}
