import { actions, selectors, types } from 'ducks/OfficeManager/users';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE, request } from 'global';
import { getBaseURL } from 'hooks/helper';
import { Query } from 'hooks/inteface';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { UsersService } from 'services';
import {
	getLocalApiUrl,
	getOnlineApiUrl,
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
	const approveUserAction = useActionDispatch(actions.approveUser);
	const requestUserTypeChangeAction = useActionDispatch(
		actions.requestUserTypeChange,
	);

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

	const approveUser = (data, extraCallback = null) => {
		setRecentRequest(types.APPROVE_USER);
		approveUserAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const requestUserTypeChange = (data, extraCallback = null) => {
		setRecentRequest(types.APPROVE_USER);
		requestUserTypeChangeAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
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
		approveUser,
		requestUserTypeChange,
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
			params?.page,
			params?.pageSize,
			params?.serverUrl,
		],
		async () => {
			let service = UsersService.list;
			if (getLocalApiUrl() !== getOnlineApiUrl()) {
				service = UsersService.listOffline;
			}

			return service(
				{
					branch_id: params?.branchId,
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
				},
				params?.serverUrl || getBaseURL(),
			).catch((e) => Promise.reject(e.errors));
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
			UsersService.retrieve(
				id,
				IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
			),
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
			IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl(),
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
					email: email,
					first_name: firstName,
					last_name: lastName,
					password: password,
					user_type: userType,
					username: username,
				},
				getBaseURL(),
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
			userType,
		}: any) =>
			UsersService.edit(
				id,
				{
					contact_number: contactNumber,
					display_name: displayName,
					email: email,
					first_name: firstName,
					last_name: lastName,
					user_type: userType,
				},
				getBaseURL(),
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
		(id: number) => UsersService.delete(id, getBaseURL()),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useUsers');
			},
		},
	);
};

export default useUsersNew;
