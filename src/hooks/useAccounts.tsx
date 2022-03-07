import { useMutation, useQuery } from 'react-query';
import { IS_APP_LIVE } from '../global/constants';
import { AccountsService, ONLINE_API_URL } from '../services';
import { getLocalIpAddress } from '../utils/function';

const useAccounts = ({ params }) =>
	useQuery<any>(
		['useAccounts', params.page, params.pageSize, params.search],
		async () =>
			AccountsService.list(
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
				accounts: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useAccountsCreate = (options = {}) =>
	useMutation(
		({
			firstName,
			middleName,
			lastName,
			businessName,
			birthday,
			businessAddress,
			homeAddress,
			contactNumber,
			gender,
		}: any) =>
			AccountsService.create(
				{
					first_name: firstName,
					middle_name: middleName,
					last_name: lastName,
					business_name: businessName,
					birthday,
					business_address: businessAddress,
					home_address: homeAddress,
					contact_number: contactNumber,
					gender,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		options,
	);

export default useAccounts;
