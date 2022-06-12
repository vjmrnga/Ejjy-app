import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { BranchMachinesService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const useBranchMachines = ({ params, options }: Query = {}) =>
	useQuery<any>(
		[
			'useBranchMachines',
			params?.page,
			params?.pageSize,
			params?.salesTimeRange,
		],
		async () =>
			BranchMachinesService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					sales_time_range: params?.salesTimeRange,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				branchMachines: query.data.results,
				total: query.data.count,
			}),
			...options,
		},
	);

export const useBranchMachineRetrieve = ({ id, options }: Query) =>
	useQuery<any>(
		['useBranchMachineRetrieve', id],
		async () =>
			BranchMachinesService.retrieve(
				id,
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors)),
		{
			select: (query) => query.data,
			...options,
		},
	);

export const useBranchMachineCreate = () =>
	useMutation<any, any, any>(
		({ branchId, name, serverUrl, posTerminal }: any) =>
			BranchMachinesService.create(
				{
					branch_id: branchId,
					name,
					server_url: serverUrl,
					pos_terminal: posTerminal,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			),
	);

export const useBranchMachineEdit = () =>
	useMutation<any, any, any>(
		({ id, branchId, name, serverUrl, posTerminal }: any) =>
			BranchMachinesService.edit(
				id,
				{
					branch_id: branchId,
					name,
					server_url: serverUrl,
					pos_terminal: posTerminal,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			),
	);

export default useBranchMachines;
