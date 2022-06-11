import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { useQuery } from 'react-query';
import { SalesTrackerService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';
import { Query } from './inteface';

const useSalesTracker = ({ params }: Query) =>
	useQuery<any>(
		['useSalesTracker', params?.page, params?.pageSize],
		async () =>
			SalesTrackerService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				salesTrackers: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useSalesTracker;
