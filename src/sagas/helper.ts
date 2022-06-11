import { getLocalApiUrl, getOnlineApiUrl } from 'utils';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { IS_APP_LIVE } from '../global/constants';
import { request } from '../global/types';

export const getBaseUrl = (branchId, callback) => {
	let baseURL: any = branchesSelectors.selectURLByBranchId(branchId);

	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
	} else {
		baseURL = IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl();
	}

	return baseURL;
};
