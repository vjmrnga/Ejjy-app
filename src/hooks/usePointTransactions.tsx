import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { PointTransactionsService } from 'services';
import { getLocalApiUrl } from 'utils';

const usePointTransactions = ({ params }: Query) =>
	useQuery<any>(
		['usePointTransactions', params?.accountId, params?.page, params?.pageSize],
		() =>
			wrapServiceWithCatch(
				PointTransactionsService.list(
					{
						account_id: params?.accountId,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						page: params?.page || DEFAULT_PAGE,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				pointTransactions: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default usePointTransactions;
