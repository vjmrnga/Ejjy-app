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
			params?.page,
			params?.pageSize,
			params?.statuses,
			params?.timeRange,
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
				page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
				page: params?.page || DEFAULT_PAGE,
				statuses: params?.statuses,
				time_range: params?.timeRange,
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
				warning: query.data?.warning,
			}),
		},
	);
};

export default useTransactionProducts;
