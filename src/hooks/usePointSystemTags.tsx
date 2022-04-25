import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ONLINE_API_URL, PointSystemTagsService } from 'services';
import { getLocalIpAddress } from 'utils/function';

const usePointSystemTags = ({ params }: Query) =>
	useQuery<any>(
		['usePointSystemTags', params?.page, params?.pageSize],
		async () =>
			PointSystemTagsService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
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
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
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
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
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
		(id: number) =>
			PointSystemTagsService.delete(
				id,
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('usePointSystemTags');
			},
		},
	);
};

export default usePointSystemTags;
