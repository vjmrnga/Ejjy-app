import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { IS_APP_LIVE } from '../global/constants';
import { request } from '../global/types';
import { ONLINE_API_URL } from '../services';
import { getLocalIpAddress } from '../utils/function';

export const getBaseUrl = (branchId, callback) => {
	let baseURL: any = branchesSelectors.selectURLByBranchId(branchId);

	if (!baseURL && branchId) {
		callback({ status: request.ERROR, errors: ['Branch has no online url.'] });
	} else {
		baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
	}

	return baseURL;
};
