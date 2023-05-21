import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, timeRangeTypes } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { LogsService } from 'services';
import { getLocalApiUrl } from 'utils';

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
		() =>
			wrapServiceWithCatch(
				LogsService.list(
					{
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						branch_machine_id: params?.branchMachineId,
						acting_user_id: params?.actingUserId,
						time_range: params?.timeRange || timeRangeTypes.DAILY,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				logs: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useLogs;
