import { useMutation, useQuery } from 'react-query';
import { IS_APP_LIVE } from '../global/constants';
import { CreditRegistrationsService, ONLINE_API_URL } from '../services';
import { getLocalIpAddress } from '../utils/function';

const useCreditRegistrations = ({ params }) =>
	useQuery<any>(
		['useCreditRegistrations', params.page, params.pageSize, params.search],
		() =>
			CreditRegistrationsService.list(
				{
					page: params.page,
					page_size: params.pageSize,
					search: params.search,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
			refetchOnWindowFocus: false,
			retry: false,
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				creditRegistrations: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useCreditRegistrationsCreate = (options = {}) =>
	useMutation(
		({ accountId, creditLimit }: any) =>
			CreditRegistrationsService.create(
				{
					account_id: accountId,
					credit_limit: creditLimit,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		options,
	);

export default useCreditRegistrations;
