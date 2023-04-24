import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CreditRegistrationsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const useCreditRegistrations = ({ params }: Query = {}) =>
	useQuery<any>(
		['useCreditRegistrations', params?.page, params?.pageSize, params?.search],
		() =>
			wrapServiceWithCatch(
				CreditRegistrationsService.list(
					{
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						search: params?.search,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				creditRegistrations: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useCreditRegistrationCreate = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ accountId, creditLimit }: any) =>
			CreditRegistrationsService.create(
				{
					account_id: accountId,
					credit_limit: creditLimit,
				},
				getOnlineApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useCreditRegistrations');
			},
		},
	);
};

export const useCreditRegistrationEdit = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, creditLimit }: any) =>
			CreditRegistrationsService.edit(
				id,
				{ credit_limit: creditLimit },
				getOnlineApiUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useCreditRegistrations');
			},
		},
	);
};

export default useCreditRegistrations;
