import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { PointTransactionsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const usePointTransactions = ({ params }: Query) =>
	useQuery<any>(
		['usePointTransactions', params?.accountId, params?.page, params?.pageSize],
		async () =>
			PointTransactionsService.list(
				{
					account_id: params?.accountId,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					page: params?.page || DEFAULT_PAGE,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				pointTransactions: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default usePointTransactions;
