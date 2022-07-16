import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { DiscountOptionsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl, isStandAlone } from 'utils';

const useDiscountOptions = ({ params }: Query) =>
	useQuery<any>(
		['useDiscountOptions', params?.page, params?.pageSize],
		() => {
			const service = isStandAlone()
				? DiscountOptionsService.list
				: DiscountOptionsService.listOffline;

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
				discountOptions: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useDiscountOptionCreate = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ additionalFields, code, isVatInclusive, name, percentage, type }: any) =>
			DiscountOptionsService.create(
				{
					additional_fields: additionalFields,
					code,
					is_vat_inclusive: isVatInclusive,
					name,
					percentage,
					type,
				},
				getOnlineApiUrl(),
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
		({
			id,
			additionalFields,
			code,
			isVatInclusive,
			name,
			percentage,
			type,
		}: any) =>
			DiscountOptionsService.edit(
				id,
				{
					additional_fields: additionalFields,
					code,
					is_vat_inclusive: isVatInclusive,
					name,
					percentage,
					type,
				},
				getOnlineApiUrl(),
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
		(id: number) => DiscountOptionsService.delete(id, getOnlineApiUrl()),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useDiscountOptions');
			},
		},
	);
};

export default useDiscountOptions;
