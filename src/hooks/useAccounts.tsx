import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from 'global';
import { wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery } from 'react-query';
import { AccountsService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl } from 'utils';

const useAccounts = ({ params }: Query) =>
	useQuery<any>(
		[
			'useAccounts',
			params?.page,
			params?.pageSize,
			params?.search,
			params?.type,
			params?.withCreditRegistration,
		],

		() =>
			wrapServiceWithCatch(
				AccountsService.list(
					{
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						search: params?.search,
						type: params?.type,
						with_credit_registration: params?.withCreditRegistration,
					},
					getLocalApiUrl(),
				),
			),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				accounts: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useAccountRetrieve = ({ id, options }: Query) =>
	useQuery<any>(
		['useAccountRetrieve', id],
		() => wrapServiceWithCatch(AccountsService.retrieve(id, getLocalApiUrl())),
		{
			select: (query) => query.data,
			...options,
		},
	);

export const useAccountCreate = () =>
	useMutation<any, any, any>(
		({
			birthday,
			businessAddress,
			businessName,
			contactNumber,
			firstName,
			gender,
			homeAddress,
			isPointSystemEligible,
			lastName,
			middleName,
			tin,
			type,
		}: any) =>
			AccountsService.create(
				{
					birthday,
					business_address: businessAddress,
					business_name: businessName,
					contact_number: contactNumber,
					first_name: firstName,
					gender,
					home_address: homeAddress,
					is_point_system_eligible: isPointSystemEligible,
					last_name: lastName,
					middle_name: middleName,
					tin,
					type,
				},
				getOnlineApiUrl(),
			),
	);

export const useAccountEdit = () =>
	useMutation<any, any, any>(
		({
			id,
			birthday,
			businessAddress,
			businessName,
			contactNumber,
			firstName,
			gender,
			homeAddress,
			isPointSystemEligible,
			lastName,
			middleName,
			tin,
			type,
		}: any) =>
			AccountsService.edit(
				id,
				{
					birthday,
					business_address: businessAddress,
					business_name: businessName,
					contact_number: contactNumber,
					first_name: firstName,
					gender,
					home_address: homeAddress,
					is_point_system_eligible: isPointSystemEligible,
					last_name: lastName,
					middle_name: middleName,
					tin,
					type,
				},
				getOnlineApiUrl(),
			),
	);

export const useAccountRedeemPoints = () =>
	useMutation<any, any, any>(
		({ id, redeemedPoints, redeemAuthorizerId, redeemRemarks }: any) =>
			AccountsService.redeemPoints(
				id,
				{
					redeem_authorizer_id: redeemAuthorizerId,
					redeem_remarks: redeemRemarks,
					redeemed_points: redeemedPoints,
				},
				getOnlineApiUrl(),
			),
	);

export default useAccounts;
