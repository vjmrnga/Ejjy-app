import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { UserLogsService } from 'services';
import { getLocalApiUrl } from 'utils';

const useUserLogs = ({ params }: Query) =>
	useQuery<any>(
		[
			'useUserLogs',
			params?.actingUserId,
			params?.branchMachineId,
			params?.branchProductId,
			params?.page,
			params?.pageSize,
			params?.productId,
			params?.timeRange,
			params?.type,
		],
		async () =>
			wrapServiceWithCatch(
				UserLogsService.list(
					{
						acting_user_id: params?.actingUserId,
						branch_machine_id: params?.branchMachineId,
						branch_product_id: params?.branchProductId,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						page: params?.page || DEFAULT_PAGE,
						product_id: params?.productId,
						time_range: params?.timeRange,
						type: params?.type,
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

export default useUserLogs;
