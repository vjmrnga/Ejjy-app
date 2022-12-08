import { appTypes } from 'global';
import { getAppType, getLocalApiUrl, getOnlineApiUrl } from 'utils';

export const getBaseUrl = (isCUD = true) => {
	const onlineApiUrl = getOnlineApiUrl();
	const localApiUrl = getLocalApiUrl();
	const appType = getAppType();

	/* Condition on what API to use for CUD services:
	 *       BO    HO
	 *  NSA  ON    ON
	 *  SA   OF    X
	 */

	let baseURL = localApiUrl;
	if (
		isCUD &&
		((appType === appTypes.BACK_OFFICE && localApiUrl !== onlineApiUrl) ||
			appType === appTypes.HEAD_OFFICE)
	) {
		baseURL = onlineApiUrl;
	}

	return baseURL;
};

export const wrapServiceWithCatch = (service) => {
	return service.catch((e) => Promise.reject(e.errors));
};
