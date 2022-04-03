import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { ONLINE_API_URL, ReceivingVouchersService } from 'services';
import { getLocalIpAddress } from 'utils/function';

const useReceivingVouchers = ({ params }: Query) =>
	useQuery<any>(
		['useReceivingVouchers', params?.page, params?.pageSize],
		async () =>
			ReceivingVouchersService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				receivingVouchers: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useReceivingVouchersCreate = () =>
	useMutation(
		({
			products,
			supplierName,
			supplierAddress,
			supplierTin,
			encodedById,
			checkedById,
		}: any) =>
			ReceivingVouchersService.create(
				{
					products: products,
					supplier_name: supplierName,
					supplier_address: supplierAddress,
					supplier_tin: supplierTin,
					encoded_by_id: encodedById,
					checked_by_id: checkedById,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
	);

export default useReceivingVouchers;
