import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { useQuery } from 'react-query';
import { CashBreakdownsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';
import { Query } from './inteface';

const useCashBreakdowns = ({ params }: Query) =>
	useQuery<any>(
		[
			'useCashBreakdowns',
			params?.branchMachineId,
			params?.category,
			params?.creatingUserId,
			params?.page,
			params?.pageSize,
			params?.timeRange,
			params?.type,
		],
		async () =>
			CashBreakdownsService.list(
				{
					branch_machine_id: params?.branchMachineId,
					category: params?.category,
					creating_user_id: params?.creatingUserId,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					page: params?.page || DEFAULT_PAGE,
					time_range: params?.timeRange,
					type: params?.type,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				cashBreakdowns: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useCashBreakdowns;
