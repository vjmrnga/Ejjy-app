import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { useQuery } from 'react-query';
import { SalesTrackerService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';
import { Query } from './inteface';

const useSalesTracker = ({ params, options }: Query) =>
	useQuery<any>(
		['useSalesTracker', params?.page, params?.pageSize],
		() =>
			wrapServiceWithCatch(
				SalesTrackerService.list(
					{
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				salesTrackers: query.data.results,
				total: query.data.count,
			}),
			...options,
		},
	);

export default useSalesTracker;
