import { actions, selectors, types } from 'ducks/OfficeManager/users';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, request, serviceTypes } from 'global';
import { getBaseUrl, wrapServiceWithCatch } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { UsersService } from 'services';
import {
	getLocalApiUrl,
	isStandAlone,
	modifiedCallback,
	modifiedExtraCallback,
	onCallback,
} from 'utils';
import {
	addInCachedData,
	executePaginatedRequest,
	getDataForCurrentPage,
	removeInCachedData,
	updateInCachedData,
} from 'utils/pagination';
import { useActionDispatch } from './useActionDispatch';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching users';

const CREATE_SUCCESS_MESSAGE = 'User was created successfully';
const CREATE_ERROR_MESSAGE = 'An error occurred while creating the user';

const EDIT_SUCCESS_MESSAGE = 'User was edited successfully';
const EDIT_ERROR_MESSAGE = 'An error occurred while editing the user';

const REMOVE_SUCCESS_MESSAGE = 'User was removed successfully';
const REMOVE_ERROR_MESSAGE = 'An error occurred while removing the user';

export const useUsers = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [warnings, setWarnings] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	// SELECTORS
	const user = useSelector(selectors.selectUser());

	// PAGINATION
	const [allData, setAllData] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageData, setCurrentPageData] = useState([]);
	const [pageSize, setPageSize] = useState(10);

	// ACTIONS
	const getUsersAction = useActionDispatch(actions.getUsers);
	const getOnlineUsersAction = useActionDispatch(actions.getOnlineUsers);
	const getUserByIdAction = useActionDispatch(actions.getUserById);
	const getOnlineUserByIdAction = useActionDispatch(actions.getOnlineUserById);
	const createUserAction = useActionDispatch(actions.createUser);
	const createOnlineUserAction = useActionDispatch(actions.createOnlineUser);
	const editUserAction = useActionDispatch(actions.editUser);
	const removeUserAction = useActionDispatch(actions.removeUser);

	// GENERAL METHODS
	const reset = () => {
		setStatus(request.NONE);
		setErrors([]);
		setWarnings([]);
	};

	const executeRequest = (data, requestCallback, action, type) => {
		setRecentRequest(type);
		action({
			...data,
			callback: onCallback(
				callback,
				requestCallback?.onSuccess,
				requestCallback?.onError,
			),
		});
	};

	const callback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
		warnings: callbackWarnings = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
		setWarnings(callbackWarnings);
	};

	// PAGINATION METHODS
	useEffect(() => {
		setCurrentPageData(
			getDataForCurrentPage({
				data: allData,
				currentPage,
				pageSize,
			}),
		);
	}, [allData, currentPage, pageSize]);

	const addItemInPagination = (item) => {
		setAllData((data) => addInCachedData({ data, item }));
	};

	const updateItemInPagination = (item) => {
		setAllData((data) => updateInCachedData({ data, item }));
	};

	const removeItemInPagination = (item) => {
		setAllData((data) => removeInCachedData({ data, item }));
	};

	// REQUEST METHODS
	const getUsers = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: getUsersAction,
			requestType: types.GET_USERS,
			errorMessage: LIST_ERROR_MESSAGE,
			allData,
			pageSize,
			executeRequest,
			setAllData,
			setPageCount,
			setCurrentPage,
			setPageSize,
		});
	};

	const getOnlineUsers = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: getOnlineUsersAction,
			requestType: types.GET_ONLINE_USERS,
			errorMessage: LIST_ERROR_MESSAGE,
			allData,
			pageSize,
			executeRequest,
			setAllData,
			setPageCount,
			setCurrentPage,
			setPageSize,
		});
	};

	const getUserById = (id, extraCallback = null) => {
		setRecentRequest(types.GET_USER_BY_ID);
		getUserByIdAction({
			id,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const getOnlineUserById = (id = 0, extraCallback = null) => {
		setRecentRequest(types.GET_ONLINE_USER_BY_ID);
		getOnlineUserByIdAction({
			id,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const createUser = (data, extraCallback = null) => {
		setRecentRequest(types.EDIT_USER);
		createUserAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(
					callback,
					CREATE_SUCCESS_MESSAGE,
					CREATE_ERROR_MESSAGE,
				),
				extraCallback,
			),
		});
	};

	const createOnlineUser = (data, extraCallback = null) => {
		setRecentRequest(types.EDIT_USER);
		createOnlineUserAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(
					callback,
					CREATE_SUCCESS_MESSAGE,
					CREATE_ERROR_MESSAGE,
				),
				extraCallback,
			),
		});
	};

	const editUser = (data, extraCallback = null) => {
		setRecentRequest(types.EDIT_USER);
		editUserAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(callback, EDIT_SUCCESS_MESSAGE, EDIT_ERROR_MESSAGE),
				extraCallback,
			),
		});
	};

	const removeUser = (id, extraCallback = null) => {
		setRecentRequest(types.REMOVE_USER);
		removeUserAction({
			id,
			callback: modifiedExtraCallback(
				modifiedCallback(
					callback,
					REMOVE_SUCCESS_MESSAGE,
					REMOVE_ERROR_MESSAGE,
				),
				extraCallback,
			),
		});
	};

	return {
		users: currentPageData,
		pageCount,
		currentPage,
		pageSize,
		addItemInPagination,
		updateItemInPagination,
		removeItemInPagination,

		user,
		getUsers,
		getOnlineUsers,
		getUserById,
		getOnlineUserById,
		createUser,
		createOnlineUser,
		editUser,
		removeUser,
		status,
		errors,
		warnings,
		recentRequest,
		reset,
	};
};

const useUsersNew = ({ params, options }: Query = {}) =>
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
			} else if (serviceTypes.ONLINE === params?.serviceType) {
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
		async () =>
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

export default useUsersNew;
