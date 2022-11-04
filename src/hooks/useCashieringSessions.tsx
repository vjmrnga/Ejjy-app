import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { CashieringSessionsService } from 'services';
import { getLocalApiUrl } from 'utils';

const useCashieringSessions = ({ params }: Query) =>
	useQuery<any>(
		[
			'useCashieringSessions',
			params?.page,
			params?.pageSize,
			params?.timeRange,
		],
		() =>
			wrapServiceWithCatch(
				CashieringSessionsService.list(
					{
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						time_range: params?.timeRange,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				cashieringSessions: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useCashieringSessions;