import axios from 'axios';
import { flatten, values } from 'lodash';
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
				modifiedError.errors = [
					'An error occurred while requesting on a local branch',
				];
			} else {
				modifiedError.errors = [
					'An error occurred while executing your request',
				];
			}
		}

		return Promise.reject(modifiedError);
	});
}
