import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { useQuery } from 'react-query';
import { ONLINE_API_URL, SalesTrackerService } from 'services';
import { getLocalIpAddress } from 'utils/function';
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
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
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
