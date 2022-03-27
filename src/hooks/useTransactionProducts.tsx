import { selectors as branchesSelectors } from 'ducks/OfficeManager/branches';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { ONLINE_API_URL, TransactionProductsService } from 'services';
import { getLocalIpAddress } from 'utils/function';
import { Query } from './inteface';

const useTransactionProducts = ({ params }: Query) => {
	let baseURL = useSelector(
		branchesSelectors.selectURLByBranchId(params.branchId),
	);

	return useQuery<any>(
		[
			'useTransactionProducts',
			params?.isVatExempted,
			params?.orNumber,
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
				is_vat_exempted: params?.isVatExempted,
				or_number: params?.orNumber,
				time_range: params?.timeRange,
				page: params?.page || DEFAULT_PAGE,
				page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
			};

			try {
				// NOTE: Fetch in branch url
				return await TransactionProductsService.list(data, baseURL);
			} catch (e) {
				// NOTE: Retry to fetch in local url
				baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
				const response = await TransactionProductsService.list(data, baseURL);
				response.data.warning =
					'Data Source: Backup Server, data might be outdated.';

				return response;
			}
		},
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				transactionProducts: query.data.results,
				total: query.data.count,
				warning: query.data.warning,
			}),
		},
	);
};

export const useTransactionProductsSummary = ({ params, options }: Query) => {
	let baseURL = useSelector(
		branchesSelectors.selectURLByBranchId(params.branchId),
	);

	return useQuery<any>(
		[
			'useTransactionProductsSummary',
			params?.isVatExempted,
			params?.orNumber,
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
				is_vat_exempted: params?.isVatExempted,
				or_number: params?.orNumber,
				time_range: params?.timeRange,
				page: params?.page || 1,
				page_size: params?.pageSize || 10,
			};

			try {
				// NOTE: Fetch in branch url
				return await TransactionProductsService.summary(data, baseURL);
			} catch (e) {
				// NOTE: Retry to fetch in local url
				baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
				const response = await TransactionProductsService.summary(
					data,
					baseURL,
				);
				response.data.warning =
					'Data Source: Backup Server, data might be outdated.';

				return response;
			}
		},
		{
			select: (query) => ({
				summary: query.data,
				warning: query.data.warning,
			}),
			...options,
		},
	);
};

export default useTransactionProducts;
