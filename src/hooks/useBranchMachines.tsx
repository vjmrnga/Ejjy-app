import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { getBaseURL } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BranchMachinesService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const useBranchMachines = ({ params, options }: Query = {}) =>
	useQuery<any>(
		[
			'useBranchMachines',
			params?.branchId,
			params?.page,
			params?.pageSize,
			params?.salesTimeRange,
		],
		async () => {
			let service = BranchMachinesService.list;
			if (getLocalApiUrl() !== getOnlineApiUrl()) {
				service = BranchMachinesService.listOffline;
			}

			return service(
				{
					branch_id: params?.branchId,
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					sales_time_range: params?.salesTimeRange,
				},
				params?.serverUrl || getBaseURL(),
			).catch((e) => Promise.reject(e.errors));
		},
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

export const useBranchMachineCreate = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({
			branchId,
			machineIdentificationNumber,
			name,
			permitToUse,
			posTerminal,
			serverUrl,
		}: any) =>
			BranchMachinesService.create(
				{
					branch_id: branchId,
					machine_identification_number: machineIdentificationNumber,
					name,
					permit_to_use: permitToUse,
					pos_terminal: posTerminal,
					server_url: serverUrl,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranchMachines');
			},
		},
	);
};

export const useBranchMachineEdit = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({
			branchId,
			id,
			machineIdentificationNumber,
			name,
			permitToUse,
			posTerminal,
			serverUrl,
		}: any) =>
			BranchMachinesService.edit(
				id,
				{
					branch_id: branchId,
					machine_identification_number: machineIdentificationNumber,
					name,
					permit_to_use: permitToUse,
					pos_terminal: posTerminal,
					server_url: serverUrl,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranchMachines');
			},
		},
	);
};

export default useBranchMachines;
