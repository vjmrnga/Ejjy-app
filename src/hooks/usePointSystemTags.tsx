import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { PointSystemTagsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl, isStandAlone } from 'utils';

const usePointSystemTags = ({ params }: Query) =>
	useQuery<any>(
		['usePointSystemTags', params?.page, params?.pageSize],
		async () => {
			let service = PointSystemTagsService.list;
			if (!isStandAlone()) {
				service = PointSystemTagsService.listOffline;
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
				getOnlineApiUrl(),
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
				getOnlineApiUrl(),
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
		(id: number) => PointSystemTagsService.delete(id, getOnlineApiUrl()),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('usePointSystemTags');
			},
		},
	);
};

export default usePointSystemTags;
