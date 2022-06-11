import axios from 'axios';
import _ from 'lodash';
import { getOnlineApiUrl } from 'utils';
import {
	GENERIC_BRANCH_ERROR_MESSAGE,
	GENERIC_ERROR_MESSAGE,
} from './global/constants';
import { API_TIMEOUT } from './services';

export default function configureAxios() {
	axios.defaults.timeout = API_TIMEOUT;

	axios.interceptors.request.use(
		(config) => config,
		(error) => Promise.reject(error),
	);

	axios.interceptors.response.use(null, (error) => {
		let modifiedError = { ...error };

		if (error.isAxiosError) {
			if (typeof error?.response?.data === 'string') {
				modifiedError.errors = [error.response.data];
			} else if (typeof error?.response?.data === 'object') {
				modifiedError.errors = _.flatten(_.values(error?.response?.data));
			} else if (
				error?.config.baseURL !== getOnlineApiUrl() &&
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
