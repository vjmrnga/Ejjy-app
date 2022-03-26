import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Mutate, Query } from 'hooks/inteface';
import {
	useMutation,
	UseMutationOptions,
	useQuery,
	useQueryClient,
} from 'react-query';
import { DiscountOptionsService, ONLINE_API_URL } from 'services';
import { getLocalIpAddress } from 'utils/function';

const useDiscountOptions = ({ params }: Query) =>
	useQuery<any>(
		['useDiscountOptions', params?.page, params?.pageSize],
		async () =>
			DiscountOptionsService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
			placeholderData: { data: { results: [], count: 0 } },
			select: (query) => ({
				discountOptions: query?.data?.results || [],
				total: query?.data?.count || 0,
			}),
		},
	);

export const useDiscountOptionsCreate = () => {
	const queryClient = useQueryClient();

	return useMutation(
		({ name, type, percentage }: any) =>
			DiscountOptionsService.create(
				{
					name,
					type,
					percentage,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useDiscountOptions');
			},
		},
	);
};

export const useDiscountOptionsEdit = () => {
	const queryClient = useQueryClient();

	return useMutation(
		({ id, name, type, percentage }: any) =>
			DiscountOptionsService.edit(
				id,
				{
					name,
					type,
					percentage,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useDiscountOptions');
			},
		},
	);
};

export const useDiscountOptionsDelete = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		(id: number) =>
			DiscountOptionsService.delete(
				id,
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useDiscountOptions');
			},
		},
	);
};

export default useDiscountOptions;
