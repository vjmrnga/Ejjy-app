import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	serviceTypes,
	timeRangeTypes,
} from 'global';
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
			params?.branchId,
			params?.branchMachineId,
			params?.branchProductId,
			params?.page,
			params?.pageSize,
			params?.productId,
			params?.serviceType,
			params?.timeRange,
			params?.type,
		],
		() => {
			let service = UserLogsService.list;
			if (serviceTypes.OFFLINE === params?.serviceType) {
				service = UserLogsService.listOffline;
			}

			return wrapServiceWithCatch(
				service(
					{
						acting_user_id: params?.actingUserId,
						branch_id: params?.branchId,
						branch_machine_id: params?.branchMachineId,
						branch_product_id: params?.branchProductId,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						page: params?.page || DEFAULT_PAGE,
						product_id: params?.productId,
						time_range: params?.timeRange || timeRangeTypes.DAILY,
						type: params?.type,
					},
					getLocalApiUrl(),
				),
			);
		},
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				logs: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useUserLogs;
