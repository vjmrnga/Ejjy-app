import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useQuery } from 'react-query';
import { SessionsService } from 'services';
import { getLocalApiUrl } from 'utils';

const useSessions = ({ params, options }: Query) =>
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
		() =>
			wrapServiceWithCatch(
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
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				sessions: query.data.results,
				total: query.data.count,
			}),
			...options,
		},
	);

export default useSessions;
