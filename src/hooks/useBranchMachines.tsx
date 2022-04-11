import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { BranchMachinesService, ONLINE_API_URL } from 'services';
import { getLocalIpAddress } from 'utils/function';

const useBranchMachines = ({ params }: Query = {}) =>
	useQuery<any>(
		['useBranchMachines', params?.page, params?.pageSize],
		async () =>
			BranchMachinesService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				branchMachines: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useBranchMachineRetrieve = ({ id, options }: Query) =>
	useQuery<any>(
		['useBranchMachineRetrieve', id],
		async () =>
			BranchMachinesService.retrieve(
				id,
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
			select: (query) => query.data,
			...options,
		},
	);

export const useBranchMachineCreate = () =>
	useMutation(({ name, serverUrl, posTerminal }: any) =>
		BranchMachinesService.create(
			{
				name,
				server_url: serverUrl,
				pos_terminal: posTerminal,
			},
			IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
		),
	);

export const useBranchMachineEdit = () =>
	useMutation(({ id, name, serverUrl, posTerminal }: any) =>
		BranchMachinesService.edit(
			id,
			{
				name,
				server_url: serverUrl,
				pos_terminal: posTerminal,
			},
			IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
		),
	);

export default useBranchMachines;
