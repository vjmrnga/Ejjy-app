import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/OfficeManager/users';
import { request } from '../global/types';
import { modifiedCallback, modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

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
	const users = useSelector(selectors.selectUsers());
	const user = useSelector(selectors.selectUser());

	// ACTIONS
	const getUsersAction = useActionDispatch(actions.getUsers);
	const getOnlineUsersAction = useActionDispatch(actions.getOnlineUsers);
	const getUserByIdAction = useActionDispatch(actions.getUserById);
	const createUserAction = useActionDispatch(actions.createUser);
	const editUserAction = useActionDispatch(actions.editUser);
	const removeUserAction = useActionDispatch(actions.removeUser);
	const approveUserAction = useActionDispatch(actions.approveUser);

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const resetWarning = () => setWarnings([]);

	const reset = () => {
		resetError();
		resetStatus();
		resetWarning();
	};

	const getUsers = (data: any = {}) => {
		setRecentRequest(types.GET_USERS);
		getUsersAction({ ...data, callback });
	};

	const getOnlineUsers = (data: any = {}) => {
		setRecentRequest(types.GET_ONLINE_USERS);
		getOnlineUsersAction({ ...data, callback });
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

	const approveUser = (id, extraCallback = null) => {
		setRecentRequest(types.APPROVE_USER);
		approveUserAction({
			id,
			callback: modifiedExtraCallback(callback, extraCallback),
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

	return {
		users,
		user,
		getUsers,
		getOnlineUsers,
		getUserById,
		createUser,
		editUser,
		removeUser,
		approveUser,
		status,
		errors,
		warnings,
		recentRequest,
		reset,
		resetStatus,
		resetError,
		resetWarning,
	};
};
