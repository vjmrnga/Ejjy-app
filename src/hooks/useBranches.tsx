import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { getBaseURL } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BranchesService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const useBranches = ({ params, options }: Query = {}) =>
	useQuery<any>(
		['useBranches', params?.baseURL, params?.page, params?.pageSize],
		async () => {
			let service = BranchesService.list;
			if (getLocalApiUrl() !== getOnlineApiUrl()) {
				service = BranchesService.listOffline;
			}

			return service(
				{
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					page: params?.page || DEFAULT_PAGE,
				},
				params?.baseURL || getBaseURL(),
			).catch((e) => Promise.reject(e.errors));
		},
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				branches: query.data.results,
				total: query.data.count,
			}),
			...options,
		},
	);

export const useBranchRetrieve = ({ id, params, options }: Query) =>
	useQuery<any>(
		['useBranchRetrieve', id, params?.baseURL],
		async () => {
			let service = BranchesService.retrieve;
			if (getLocalApiUrl() !== getOnlineApiUrl()) {
				service = BranchesService.retrieveOffline;
			}

			return service(id, params?.baseURL || getBaseURL()).catch((e) =>
				Promise.reject(e.errors),
			);
		},
		{
			select: (query) => query.data,
			...options,
		},
	);

export const useBranchCreate = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ name, onlineUrl }: any) =>
			BranchesService.create(
				{
					name,
					online_url: onlineUrl,
				},
				getOnlineApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranches');
			},
		},
	);
};

export const useBranchEdit = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, name, onlineUrl }: any) =>
			BranchesService.edit(
				id,
				{
					name,
					online_url: onlineUrl,
				},
				getOnlineApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranches');
			},
		},
	);
};

export const useBranchDelete = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		(id: number) => BranchesService.delete(id, getOnlineApiUrl()),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranches');
			},
		},
	);
};

export default useBranches;
