import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/OfficeManager/users';
import { request } from '../global/types';
import {
	modifiedCallback,
	modifiedExtraCallback,
	onCallback,
} from '../utils/function';
import {
	getDataForCurrentPage,
	addInCachedData,
	updateInCachedData,
	removeInCachedData,
	executePaginatedRequest,
} from '../utils/pagination';
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
	const createUserAction = useActionDispatch(actions.createUser);
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

	const getUserById = (id = 0, extraCallback = null) => {
		setRecentRequest(types.GET_USER_BY_ID);
		getUserByIdAction({
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
		createUser,
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
