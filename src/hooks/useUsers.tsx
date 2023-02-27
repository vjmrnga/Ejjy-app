import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, serviceTypes } from 'global';
import { getBaseUrl, wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { UsersService } from 'services';
import { getLocalApiUrl, isStandAlone } from 'utils';

const useUsers = ({ params, options }: Query = {}) =>
	useQuery<any>(
		[
			'useUsers',
			params?.branchId,
			params?.isPendingCreateApproval,
			params?.isPendingUpdateUserTypeApproval,
			params?.page,
			params?.pageSize,
			params?.serverUrl,
			params?.serviceType,
		],
		() => {
			let service = isStandAlone()
				? UsersService.list
				: UsersService.listOffline;

			if (serviceTypes.OFFLINE === params?.serviceType) {
				service = UsersService.listOffline;
			} else if (serviceTypes.NORMAL === params?.serviceType) {
				service = UsersService.list;
			}

			return wrapServiceWithCatch(
				service(
					{
						branch_id: params?.branchId,
						page: params?.page || DEFAULT_PAGE,
						page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
						is_pending_create_approval: params?.isPendingCreateApproval,
						is_pending_update_user_type_approval:
							params?.isPendingUpdateUserTypeApproval,
					},
					params?.serverUrl || getLocalApiUrl(),
				),
			);
		},
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				users: query.data.results,
				total: query.data.count,
			}),
			...options,
		},
	);

export const useUserRetrieve = ({ id, options }: Query) =>
	useQuery<any>(
		['useUserRetrieve', id],
		() =>
			// NOTE: We didn't catch the this request so we can check the status code of the error
			UsersService.retrieve(id, getLocalApiUrl()),
		{
			select: (query) => query.data,
			...options,
		},
	);

export const useUserAuthenticate = () =>
	useMutation<any, any, any>(({ login, password }: any) =>
		UsersService.authenticate(
			{
				login,
				password,
			},
			getLocalApiUrl(),
		),
	);

export const useUserCreate = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({
			contactNumber,
			displayName,
			email,
			firstName,
			lastName,
			password,
			userType,
			username,
		}: any) =>
			UsersService.create(
				{
					contact_number: contactNumber,
					display_name: displayName,
					email,
					first_name: firstName,
					last_name: lastName,
					password,
					user_type: userType,
					username,
				},
				getBaseUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useUsers');
			},
		},
	);
};

export const useUserApprove = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({ id, pendingApprovalType }: any) =>
			UsersService.approve(
				id,
				{
					pending_approval_type: pendingApprovalType,
				},
				getBaseUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useUsers');
			},
		},
	);
};

export const useUserEdit = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({
			id,
			contactNumber,
			displayName,
			email,
			firstName,
			lastName,
			password,
			userType,
		}: any) =>
			UsersService.edit(
				id,
				{
					contact_number: contactNumber,
					display_name: displayName,
					email,
					first_name: firstName,
					last_name: lastName,
					password,
					user_type: userType,
				},
				getBaseUrl(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useUsers');
			},
		},
	);
};

export const useUserDelete = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		(id: number) => UsersService.delete(id, getBaseUrl()),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useUsers');
			},
		},
	);
};

export const useUserRequestUserTypeChange = () =>
	useMutation<any, any, any>(({ id, newUserType }: any) =>
		UsersService.requestUserTypeChange(
			id,
			{
				new_user_type: newUserType,
			},
			getBaseUrl(),
		),
	);

export default useUsers;
