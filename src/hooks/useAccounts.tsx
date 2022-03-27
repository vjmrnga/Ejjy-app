import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { AccountsService, ONLINE_API_URL } from 'services';
import { getLocalIpAddress } from 'utils/function';

const useAccounts = ({ params }: Query) =>
	useQuery<any>(
		[
			'useAccounts',
			params?.page,
			params?.pageSize,
			params?.search,
			params?.type,
		],
		async () =>
			AccountsService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					search: params?.search,
					type: params?.type,
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

export const useAccountsCreate = () =>
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
	);

export const useAccountsEdit = () =>
	useMutation(
		({
			id,
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
			AccountsService.edit(
				id,
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
	);

export default useAccounts;
