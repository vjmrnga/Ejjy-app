import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { selectors as branchesSelectors } from '../ducks/OfficeManager/branches';
import { IS_APP_LIVE } from '../global/constants';
import { ONLINE_API_URL, TransactionsService } from '../services';
import { getLocalIpAddress } from '../utils/function';
import { Query } from './inteface';

const useTransactions = ({ params }) => {
	let baseURL = useSelector(
		branchesSelectors.selectURLByBranchId(params.branchId),
	);

	return useQuery<any>(
		[
			'useTransactions',
			params.branchId,
			params.isAdjusted,
			params.modeOfPayment,
			params.payorCreditorAccountId,
			params.serverUrl,
			params.statuses,
			params.timeRange,
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
				is_adjusted: params.isAdjusted || false,
				mode_of_payment: params.modeOfPayment,
				payor_creditor_account_id: params.payorCreditorAccountId,
				statuses: params.statuses,
				time_range: params.timeRange,
				page: params.page || 1,
				page_size: params.pageSize || 10,
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
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				transactions: query.data.results,
				total: query.data.count,
				warning: query.data.warning,
			}),
		},
	);
};

export const useTransactionRetrieve = ({ id, params, options }: Query) => {
	let baseURL = useSelector(
		branchesSelectors.selectURLByBranchId(params.branchId),
	);

	return useQuery<any>(
		['useBackOrderRetrieve', id],

		async () => {
			if (!baseURL && params.branchId) {
				throw ['Branch has no online url.'];
			} else {
				baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
			}

			baseURL = params.serverUrl || baseURL;

			try {
				// NOTE: Fetch in branch url
				return await TransactionsService.retrieve(id, baseURL);
			} catch (e) {
				// NOTE: Retry to fetch in local url
				baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
				const response = await TransactionsService.retrieve(id, baseURL);
				response.data.warning =
					'Data Source: Backup Server, data might be outdated.';

				return response;
			}
		},
		{
			select: (query) => query.data,
			...options,
		},
	);
};

export default useTransactions;
