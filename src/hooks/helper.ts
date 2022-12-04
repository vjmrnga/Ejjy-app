import { appTypes } from 'global';
import { getAppType, getLocalApiUrl, getOnlineApiUrl } from 'utils';

export const getBaseUrl = (isCUD = true) => {
	const onlineApiUrl = getOnlineApiUrl();
	const localApiUrl = getLocalApiUrl();
	const appType = getAppType();

	/* Condition on what API to use for CUD services:
	 *       BO    HO
	 *  NSA  ON    OF
	 *  SA   OF    OF
	 */

	let baseURL = localApiUrl;
	if (
		isCUD &&
		appType === appTypes.BACK_OFFICE &&
		localApiUrl !== onlineApiUrl
	) {
		baseURL = onlineApiUrl;
	}

	return baseURL;
};

export const wrapServiceWithCatch = (service) => {
	return service.catch((e) => Promise.reject(e.errors));
};
