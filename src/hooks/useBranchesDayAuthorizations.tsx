import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { IS_APP_LIVE } from '../global/constants';
import { BranchesDayService, ONLINE_API_URL } from '../services';
import { getLocalIpAddress } from '../utils/function';

const useBranchesDayAuthorizations = ({ params }) =>
	useQuery<any>(
		[
			'useBranchesDayAuthorizations',
			params.baseUrl,
			params.page,
			params.pageSize,
			params.timeRange,
			params.type,
		],
		async () =>
			BranchesDayService.listAuthorizations(
				{
					page: params.page,
					page_size: params.pageSize,
				},
				params.baseUrl,
			).catch((e) => Promise.reject(e.errors)),
		{
			refetchOnWindowFocus: false,
			retry: false,
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				branchDays: query.data.results,
				total: query.data.count,
			}),
		},
	);

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
			refetchOnWindowFocus: false,
			retry: false,
			select: (query) => query.data,
		},
	);
};

export const useBranchesDayAuthorizationsCreate = (branchId, options = {}) => {
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
	}, options);
};

export default useBranchesDayAuthorizations;
