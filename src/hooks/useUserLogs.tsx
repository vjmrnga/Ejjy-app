import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { ONLINE_API_URL, UserLogsService } from 'services';
import { getLocalIpAddress } from '../utils/function';

const useUserLogs = ({ params }: Query) =>
	useQuery<any>(
		[
			'useUserLogs',
			params?.page,
			params?.pageSize,
			params?.timeRange,
			params?.type,
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
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
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
