import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ProductCategoriesService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl, isStandAlone } from 'utils';

const useProductCategories = ({ params }: Query) =>
	useQuery<any>(
		['useProductCategories', params?.page, params?.pageSize],
		async () => {
			let service = ProductCategoriesService.list;
			if (!isStandAlone()) {
				service = ProductCategoriesService.listOffline;
			}

			return service(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
				},
				getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors));
		},
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				productCategories: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useProductCategoryCreate = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ name, priorityLevel }: any) =>
			ProductCategoriesService.create(
				{
					name,
					priority_level: priorityLevel,
				},
				getOnlineApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useProductCategories');
			},
		},
	);
};

export const useProductCategoryEdit = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, name, priorityLevel }: any) =>
			ProductCategoriesService.edit(
				id,
				{
					name,
					priority_level: priorityLevel,
				},
				getOnlineApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useProductCategories');
			},
		},
	);
};

export const useProductCategoryDelete = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		(id: number) => ProductCategoriesService.delete(id, getOnlineApiUrl()),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useProductCategories');
			},
		},
	);
};

export default useProductCategories;
