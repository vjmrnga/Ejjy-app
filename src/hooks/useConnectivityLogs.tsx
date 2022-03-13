import { promises } from 'dns';
import { useQuery } from 'react-query';
import { ConnectivityLogsService } from '../services';

const useConnectivityLogs = ({ params }) =>
	useQuery<any>(
		[
			'useConnectivityLogs',
			params.baseUrl,
			params.page,
			params.pageSize,
			params.timeRange,
			params.type,
		],
		() =>
			ConnectivityLogsService.list(
				{
					page: params.page,
					page_size: params.pageSize,
					time_range: params.timeRange,
					type: params.type,
				},
				params.baseUrl,
			).catch((e) => Promise.reject(e.errors)),
		{
			refetchOnWindowFocus: false,
			retry: false,
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				connectivityLogs: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useConnectivityLogs;
