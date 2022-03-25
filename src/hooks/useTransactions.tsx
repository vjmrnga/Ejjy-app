import { selectors as branchesSelectors } from 'ducks/OfficeManager/branches';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global/';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { ONLINE_API_URL, TransactionsService } from 'services';
import { getLocalIpAddress } from 'utils/function';
import { Query } from './inteface';

const useTransactions = ({ params }: Query) => {
	let baseURL = useSelector(
		branchesSelectors.selectURLByBranchId(params.branchId),
	);

	return useQuery<any>(
		[
			'useTransactions',
			params?.branchId,
			params?.isAdjusted,
			params?.modeOfPayment,
			params?.orNumber,
			params?.payorCreditorAccountId,
			params?.serverUrl,
			params?.statuses,
			params?.timeRange,
			params?.page,
			params?.pageSize,
		],
		async () => {
			if (!baseURL && params.branchId) {
				throw ['Branch has no online url.'];
			} else {
				baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
			}

			baseURL = params.serverUrl || baseURL;

			const data = {
				is_adjusted: params?.isAdjusted || false,
				mode_of_payment: params?.modeOfPayment,
				or_number: params?.orNumber,
				payor_creditor_account_id: params?.payorCreditorAccountId,
				statuses: params?.statuses,
				time_range: params?.timeRange,
				page: params?.page || DEFAULT_PAGE,
				page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
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
		['useTransactionRetrieve', id],

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
