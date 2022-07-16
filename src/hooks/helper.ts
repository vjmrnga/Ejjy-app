import { IS_APP_LIVE } from 'global';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

export const getBaseURL = () => {
	const onlineApiUrl = getOnlineApiUrl();
	const localApiUrl = getLocalApiUrl();

	let baseURL = IS_APP_LIVE ? onlineApiUrl : localApiUrl;
	if (localApiUrl !== onlineApiUrl) {
		baseURL = localApiUrl;
	}

	return baseURL;
};

export const wrapServiceWithCatch = (service) => {
	return service.catch((e) => Promise.reject(e.errors));
};
