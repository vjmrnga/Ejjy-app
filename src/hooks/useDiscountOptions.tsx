import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { DiscountOptionsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const useDiscountOptions = ({ params }: Query) =>
	useQuery<any>(
		['useDiscountOptions', params?.page, params?.pageSize],
		async () =>
			DiscountOptionsService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
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
		({ name, type, percentage, isVatInclusive, additionalFields }: any) =>
			DiscountOptionsService.create(
				{
					name,
					type,
					percentage,
					is_vat_inclusive: isVatInclusive,
					additional_fields: additionalFields,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
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
		({ id, name, type, percentage, isVatInclusive, additionalFields }: any) =>
			DiscountOptionsService.edit(
				id,
				{
					name,
					type,
					percentage,
					is_vat_inclusive: isVatInclusive,
					additional_fields: additionalFields,
				},

				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
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
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useDiscountOptions');
			},
		},
	);
};

export default useDiscountOptions;
