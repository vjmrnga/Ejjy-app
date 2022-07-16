import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, timeRangeTypes } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { ConnectivityLogsService } from 'services';
import { getLocalApiUrl } from 'utils';

const useConnectivityLogs = ({ params, options }: Query) =>
	useQuery<any>(
		[
			'useConnectivityLogs',
			params?.branchMachineId,
			params?.page,
			params?.pageSize,
			params?.timeRange,
			params?.type,
		],
		async () =>
			wrapServiceWithCatch(
				ConnectivityLogsService.list(
					{
						branch_machine_id: params?.branchMachineId,
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						time_range:
							params?.timeRange === timeRangeTypes.DAILY
								? null
								: params?.timeRange,
						type: params?.type,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				connectivityLogs: query.data.results,
				total: query.data.count,
			}),
			...options,
		},
	);

export default useConnectivityLogs;
