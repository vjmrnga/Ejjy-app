import { selectors as branchesSelectors } from 'ducks/OfficeManager/branches';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global/';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { TransactionsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';
import { Query } from './inteface';

const useTransactions = ({ params }: Query) => {
	let baseURL = useSelector(
		branchesSelectors.selectURLByBranchId(params?.branchId),
	);

	return useQuery<any>(
		[
			'useTransactions',
			params?.branchId,
			params?.branchMachineId,
			params?.isAdjusted,
			params?.modeOfPayment,
			params?.orNumber,
			params?.page,
			params?.pageSize,
			params?.payorCreditorAccountId,
			params?.serverUrl,
			params?.statuses,
			params?.timeRange,
		],
		async () => {
			if (!baseURL && params.branchId) {
				throw ['Branch has no online url.'];
			} else {
				baseURL = IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl();
			}

			baseURL = params.serverUrl || baseURL;

			const data = {
				branch_machine_id: params?.branchMachineId,
				is_adjusted: params?.isAdjusted,
				mode_of_payment: params?.modeOfPayment,
				or_number: params?.orNumber,
				page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
				page: params?.page || DEFAULT_PAGE,
				payor_creditor_account_id: params?.payorCreditorAccountId,
				statuses: params?.statuses,
				time_range: params?.timeRange,
			};

			try {
				// NOTE: Fetch in branch url
				return await TransactionsService.list(data, baseURL);
			} catch (e) {
				// NOTE: Retry to fetch in local url
				baseURL = IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl();
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
				warning: query.data?.warning,
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
				baseURL = IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl();
			}

			baseURL = params.serverUrl || baseURL;

			try {
				// NOTE: Fetch in branch url
				return await TransactionsService.retrieve(id, baseURL);
			} catch (e) {
				// NOTE: Retry to fetch in local url
				baseURL = IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl();
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

export const useTransactionsSummary = ({ params, options }: Query) => {
	let baseURL = useSelector(
		branchesSelectors.selectURLByBranchId(params.branchId),
	);

	return useQuery<any>(
		[
			'useTransactionsSummary',
			params?.branchMachineId,
			params?.statuses,
			params?.timeRange,
		],

		async () => {
			if (!baseURL && params.branchId) {
				throw ['Branch has no online url.'];
			} else {
				baseURL = IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl();
			}

			baseURL = params.serverUrl || baseURL;

			const data = {
				branch_machine_id: params?.branchMachineId,
				statuses: params?.statuses,
				time_range: params?.timeRange,
			};

			try {
				// NOTE: Fetch in branch url
				return await TransactionsService.summary(data, baseURL);
			} catch (e) {
				// NOTE: Retry to fetch in local url
				baseURL = IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl();
				const response = await TransactionsService.summary(data, baseURL);
				response.data.warning =
					'Data Source: Backup Server, data might be outdated.';

				return response;
			}
		},
		{
			initialData: { data: null },
			select: (query) => ({
				summary: query.data,
				warning: query.data?.warning,
			}),
			...options,
		},
	);
};

export default useTransactions;
