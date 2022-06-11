import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { UserLogsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const useUserLogs = ({ params }: Query) =>
	useQuery<any>(
		[
			'useUserLogs',
			params?.actingUserId,
			params?.branchMachineId,
			params?.pageSize,
			params?.page,
			params?.timeRange,
		],
		async () =>
			UserLogsService.list(
				{
					acting_user_id: params?.actingUserId,
					branch_machine_id: params?.branchMachineId,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					page: params?.page || DEFAULT_PAGE,
					time_range: params?.timeRange,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				logs: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useUserLogs;
