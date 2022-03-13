import { useMutation, useQuery } from 'react-query';
import { IS_APP_LIVE } from '../global/constants';
import { ONLINE_API_URL, OrderOfPaymentsService } from '../services';
import { getLocalIpAddress } from '../utils/function';

const useOrderOfPayments = ({ params }) =>
	useQuery<any>(
		['useOrderOfPayments', params.page, params.pageSize, params.isPending],
		async () =>
			OrderOfPaymentsService.list(
				{
					page: params.page,
					page_size: params.pageSize,
					is_pending: params.isPending,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
			refetchOnWindowFocus: false,
			retry: false,
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				orderOfPayments: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useOrderOfPaymentsCreate = (options = {}) =>
	useMutation(
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
