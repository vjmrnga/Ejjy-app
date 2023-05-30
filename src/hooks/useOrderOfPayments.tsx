import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, timeRangeTypes } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { OrderOfPaymentsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl, isStandAlone } from 'utils';

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
		() => {
			const service = isStandAlone()
				? OrderOfPaymentsService.list
				: OrderOfPaymentsService.listOffline;

			return wrapServiceWithCatch(
				service(
					{
						is_pending: params?.isPending,
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						payor_id: params?.payorId,
						time_range: params?.timeRange || timeRangeTypes.DAILY,
					},
					getLocalApiUrl(),
				),
			);
		},
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
					amount,
					purpose,
					extra_description: extraDescription,
					charge_sales_transaction_id: chargeSalesTransactionId,
				},
				getOnlineApiUrl(),
			),
		options,
	);

export default useOrderOfPayments;
