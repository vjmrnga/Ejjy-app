import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { getBaseUrl, wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { PointSystemTagsService } from 'services';
import { getLocalApiUrl, isStandAlone } from 'utils';

const usePointSystemTags = ({ params }: Query) =>
	useQuery<any>(
		['usePointSystemTags', params?.page, params?.pageSize],
		() => {
			const service = isStandAlone()
				? PointSystemTagsService.list
				: PointSystemTagsService.listOffline;

			return wrapServiceWithCatch(
				service(
					{
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					},
					getLocalApiUrl(),
				),
			);
		},
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				pointSystemTags: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const usePointSystemTagCreate = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ name, divisorAmount }: any) =>
			PointSystemTagsService.create(
				{
					name,
					divisor_amount: divisorAmount,
				},
				getBaseUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('usePointSystemTags');
			},
		},
	);
};

export const usePointSystemTagEdit = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, name, divisorAmount }: any) =>
			PointSystemTagsService.edit(
				id,
				{
					name,
					divisor_amount: divisorAmount,
				},
				getBaseUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('usePointSystemTags');
			},
		},
	);
};

export const usePointSystemTagDelete = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		(id: number) => PointSystemTagsService.delete(id, getBaseUrl()),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('usePointSystemTags');
			},
		},
	);
};

export default usePointSystemTags;
