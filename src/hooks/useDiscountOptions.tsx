import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
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
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				discountOptions: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useDiscountOptionCreate = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ name, type, percentage, isVatInclusive }: any) =>
			DiscountOptionsService.create(
				{
					name,
					type,
					percentage,
					is_vat_inclusive: isVatInclusive,
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

export const useDiscountOptionEdit = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, name, type, percentage, isVatInclusive }: any) =>
			DiscountOptionsService.edit(
				id,
				{
					name,
					type,
					percentage,
					is_vat_inclusive: isVatInclusive,
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

export const useDiscountOptionDelete = () => {
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