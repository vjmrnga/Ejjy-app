import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { ONLINE_API_URL, OrderOfPaymentsService } from 'services';
import { getLocalIpAddress } from 'utils/function';

const useOrderOfPayments = ({ params }: Query) =>
	useQuery<any>(
		[
			'useOrderOfPayments',
			params?.isPending,
			params?.payorId,
			params?.timeRange,
			params?.page,
			params?.pageSize,
		],
		async () =>
			OrderOfPaymentsService.list(
				{
					is_pending: params?.isPending,
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					payor_id: params?.payorId,
					time_range: params?.timeRange,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				orderOfPayments: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useOrderOfPaymentsCreate = (options = {}) =>
	useMutation<any, any, any>(
		({
			createdById,
			payorId,
			amount,
			purpose,
			extraDescription,
			chargeSalesTransactionId,
		}: any) =>
			OrderOfPaymentsService.create(
				{
					created_by_id: createdById,
					payor_id: payorId,
					amount: amount,
					purpose: purpose,
					extra_description: extraDescription,
					charge_sales_transaction_id: chargeSalesTransactionId,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		options,
	);

export default useOrderOfPayments;
