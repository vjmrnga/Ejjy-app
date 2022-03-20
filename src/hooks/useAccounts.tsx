import { useMutation, useQuery } from 'react-query';
import { IS_APP_LIVE } from '../global/constants';
import { AccountsService, ONLINE_API_URL } from '../services';
import { getLocalIpAddress } from '../utils/function';

const useAccounts = ({ params }) =>
	useQuery<any>(
		['useAccounts', params.page, params.pageSize, params.search, params.type],
		async () =>
			AccountsService.list(
				{
					page: params.page || 1,
					page_size: params.pageSize || 10,
					search: params.search,
					type: params.type,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
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
			tin,
			businessAddress,
			homeAddress,
			contactNumber,
			gender,
			type,
		}: any) =>
			AccountsService.create(
				{
					first_name: firstName,
					middle_name: middleName,
					last_name: lastName,
					business_name: businessName,
					birthday,
					tin,
					business_address: businessAddress,
					home_address: homeAddress,
					contact_number: contactNumber,
					gender,
					type,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		options,
	);

export default useAccounts;
