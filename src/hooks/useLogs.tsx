import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { LogsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const useLogs = ({ params }: Query) =>
	useQuery<any>(
		[
			'useLogs',
			params?.timeRange,
			params?.page,
			params?.pageSize,
			params?.timeRange,
			params?.type,
		],
		async () =>
			LogsService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					branch_machine_id: params?.branchMachineId,
					acting_user_id: params?.actingUserId,
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

export default useLogs;
