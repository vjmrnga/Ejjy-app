import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { SessionsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const useSessions = ({ params }: Query) =>
	useQuery<any>(
		[
			'useSessions',
			params?.branchId,
			params?.branchMachineId,
			params?.isAutomaticallyClosed,
			params?.isUnauthorized,
			params?.page,
			params?.pageSize,
			params?.timeRange,
			params?.userId,
		],
		async () =>
			SessionsService.list(
				{
					branch_id: params?.branchId,
					branch_machine_id: params?.branchMachineId,
					is_automatically_closed: params?.isAutomaticallyClosed,
					is_unauthorized: params?.isUnauthorized,
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					time_range: params?.timeRange,
					user_id: params?.userId,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				sessions: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useSessions;
