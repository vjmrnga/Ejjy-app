import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { IS_APP_LIVE } from '../global/constants';
import { ONLINE_API_URL, TransactionsService } from '../services';
import { getLocalIpAddress } from '../utils/function';

const useTransactions = ({ params }) => {
	let baseURL = useSelector(
		branchesSelectors.selectURLByBranchId(params.branchId),
	);

	return useQuery<any>(
		[
			'useTransactions',
			params.timeRange,
			params.statuses,
			params.modeOfPayment,
			params.branchId,
			params.serverUrl,
			params.page,
			params.pageSize,
		],
		async () => {
			if (!baseURL && params.branchId) {
				throw ['Branch has no online url.'];
			} else {
				baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
			}

			baseURL = params.serverUrl || baseURL;

			const data = {
				statuses: params.statuses,
				time_range: params.timeRange,
				mode_of_payment: params.modeOfPayment,
				page: params.page,
				page_size: params.pageSize,
			};

			try {
				// NOTE: Fetch in branch url
				return await TransactionsService.list(data, baseURL);
			} catch (e) {
				// NOTE: Retry to fetch in local url
				baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
				const response = await TransactionsService.list(
					{
						branch_machine_id: params.branchMachineId,
						...data,
					},
					baseURL,
				);
				response.data.warning =
					'Data Source: Backup Server, data might be outdated.';

				return response;
			}
		},
		{
			refetchOnWindowFocus: false,
			retry: false,
			initialData: { data: { results: [], count: 0 } },
			select: (query) => {
				console.log('query', query);
				return {
					transactions: query.data.results,
					total: query.data.count,
					warning: query.data.warning,
				};
			},
		},
	);
};

export default useTransactions;
