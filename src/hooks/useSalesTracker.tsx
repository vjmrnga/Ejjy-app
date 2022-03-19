import { useQuery } from 'react-query';
import { IS_APP_LIVE } from '../global/constants';
import { ONLINE_API_URL, SalesTrackerService } from '../services';
import { getLocalIpAddress } from '../utils/function';
import { Query } from './inteface';

const useSalesTracker = ({ params }: Query) =>
	useQuery<any>(
		['useSalesTracker', params.page, params.pageSize],
		async () =>
			SalesTrackerService.list(
				{
					page: params.page,
					page_size: params.pageSize,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
			select: (query) => ({
				salesTrackers: query?.data?.results || [],
				total: query?.data?.count || 0,
			}),
		},
	);

export default useSalesTracker;
