import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { CreditRegistrationsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const useCreditRegistrations = ({ params }: Query = {}) =>
	useQuery<any>(
		['useCreditRegistrations', params?.page, params?.pageSize, params?.search],
		() =>
			CreditRegistrationsService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					search: params?.search,
				},
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				creditRegistrations: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useCreditRegistrationsCreate = () =>
	useMutation<any, any, any>(({ accountId, creditLimit }: any) =>
		CreditRegistrationsService.create(
			{
				account_id: accountId,
				credit_limit: creditLimit,
			},
			IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
		),
	);

export const useCreditRegistrationsEdit = () =>
	useMutation<any, any, any>(({ id, creditLimit }: any) =>
		CreditRegistrationsService.edit(
			id,
			{
				credit_limit: creditLimit,
			},
			IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
		),
	);

export default useCreditRegistrations;
