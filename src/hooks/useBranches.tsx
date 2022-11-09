import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, serviceTypes } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BranchesService } from 'services';
import { getGoogleApiUrl, getLocalApiUrl, isStandAlone } from 'utils';

const useBranches = ({ key, params, options }: Query = {}) =>
	useQuery<any>(
		[
			'useBranches',
			params?.baseURL,
			params?.page,
			params?.pageSize,
			params?.serviceType,
			key,
		],
		() => {
			let service = isStandAlone()
				? BranchesService.list
				: BranchesService.listOffline;

			if (serviceTypes.NORMAL === params?.serviceType) {
				service = BranchesService.list;
			}

			if (serviceTypes.OFFLINE === params?.serviceType) {
				service = BranchesService.listOffline;
			}

			return wrapServiceWithCatch(
				service(
					{
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						page: params?.page || DEFAULT_PAGE,
					},
					params?.baseURL || getLocalApiUrl(),
				),
			);
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
		() => {
			const service = isStandAlone()
				? BranchesService.retrieve
				: BranchesService.retrieveOffline;

			return wrapServiceWithCatch(
				service(id, params?.baseURL || getLocalApiUrl()),
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
				getGoogleApiUrl(),
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
				getGoogleApiUrl(),
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
		(id: number) => BranchesService.delete(id, getGoogleApiUrl()),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranches');
			},
		},
	);
};

export default useBranches;
