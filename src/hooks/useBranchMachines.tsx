import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BranchMachinesService } from 'services';
import {
	getGoogleApiUrl,
	getLocalApiUrl,
	getOnlineApiUrl,
	isStandAlone,
} from 'utils';

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
			const service = isStandAlone()
				? BranchMachinesService.list
				: BranchMachinesService.listOffline;

			return wrapServiceWithCatch(
				service(
					{
						branch_id: params?.branchId,
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						sales_time_range: params?.salesTimeRange,
					},
					getLocalApiUrl(),
				),
			);
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
			BranchMachinesService.retrieve(id, getLocalApiUrl()).catch((e) =>
				Promise.reject(e.errors),
			),
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
			type,
		}: any) =>
			BranchMachinesService.create(
				{
					branch_id: branchId,
					machine_identification_number: machineIdentificationNumber,
					name,
					permit_to_use: permitToUse,
					pos_terminal: posTerminal,
					server_url: serverUrl,
					type,
				},
				getGoogleApiUrl(),
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
			type,
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
					type,
				},
				getGoogleApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranchMachines');
			},
		},
	);
};

export const useBranchMachineDelete = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		(id: number) => BranchMachinesService.delete(id, getOnlineApiUrl()),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranchMachines');
			},
		},
	);
};

export default useBranchMachines;
