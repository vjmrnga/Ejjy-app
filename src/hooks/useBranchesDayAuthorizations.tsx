import { selectors as branchesSelectors } from 'ducks/OfficeManager/branches';
import { IS_APP_LIVE } from 'global';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { BranchesDayService, ONLINE_API_URL } from 'services';
import { getLocalIpAddress } from 'utils/function';

export const useBranchesDayAuthorizationsRetrieve = ({ branchId }) => {
	let baseURL = useSelector(branchesSelectors.selectURLByBranchId(branchId));

	return useQuery<any>(
		['useBranchesDayAuthorizationsRetrieve', branchId],
		() => {
			if (!baseURL && branchId) {
				throw ['Branch has no online url.'];
			} else {
				baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
			}

			return BranchesDayService.retrieveLatestAuthorization(baseURL).catch(
				(e) => Promise.reject(e.errors),
			);
		},
		{
			select: (query) => query?.data,
		},
	);
};

export const useBranchesDayAuthorizationsCreate = ({ branchId }) => {
	let baseURL = useSelector(branchesSelectors.selectURLByBranchId(branchId));

	return useMutation(({ onlineStartedById, startedById }: any) => {
		if (!baseURL && branchId) {
			throw ['Branch has no online url.'];
		} else {
			baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
		}

		return BranchesDayService.createAuthorization(
			{
				started_by_id: startedById,
				online_started_by_id: onlineStartedById,
			},
			baseURL,
		);
	});
};
