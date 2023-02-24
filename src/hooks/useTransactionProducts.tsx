import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { useQuery } from 'react-query';
import { TransactionProductsService } from 'services';
import { getLocalApiUrl } from 'utils';
import { Query } from './inteface';

const useTransactionProducts = ({ params, options }: Query) =>
	useQuery<any>(
		[
			'useTransactionProducts',
			params?.isVatExempted,
			params?.orNumber,
			params?.page,
			params?.pageSize,
			params?.statuses,
			params?.timeRange,
		],
		() =>
			wrapServiceWithCatch(
				TransactionProductsService.list(
					{
						is_vat_exempted: params?.isVatExempted,
						or_number: params?.orNumber,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						page: params?.page || DEFAULT_PAGE,
						statuses: params?.statuses,
						time_range: params?.timeRange,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				transactionProducts: query.data.results,
				total: query.data.count,
			}),
			...options,
		},
	);

export default useTransactionProducts;
