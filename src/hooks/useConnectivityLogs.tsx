import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, timeRangeTypes } from 'global';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { ConnectivityLogsService } from 'services';

const useConnectivityLogs = ({ params }: Query) =>
	useQuery<any>(
		[
			'useConnectivityLogs',
			params?.baseUrl,
			params?.page,
			params?.pageSize,
			params?.timeRange,
			params?.type,
		],
		() =>
			ConnectivityLogsService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					time_range:
						params?.timeRange === timeRangeTypes.DAILY
							? null
							: params?.timeRange,
					type: params?.type,
				},
				params?.baseUrl,
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				connectivityLogs: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useConnectivityLogs;
