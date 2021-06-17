import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/auth';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';

export const useAuth = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	const user = useSelector(selectors.selectUser());
	const accessToken = useSelector(selectors.selectAccessToken());
	const refreshToken = useSelector(selectors.selectRefreshToken());
	const localIpAddress = useSelector(selectors.selectLocalIpAddress());

	const login = useActionDispatch(actions.login);
	const loginOnline = useActionDispatch(actions.loginOnline);
	const logout = useActionDispatch(actions.logout);
	const retrieveUser = useActionDispatch(actions.retrieveUser);
	const saveAction = useActionDispatch(actions.save);

	const loginRequest = (data) => {
		login({ ...data, callback });
	};

	const loginOnlineRequest = (data) => {
		loginOnline({ ...data, callback });
	};

	const logoutRequest = (id: number) => {
		logout({ id });
	};

	const retrieveUserRequest = (id, loginCount) => {
		retrieveUser({ id, loginCount });
	};

	const updateLocalIpAddress = (newLocalIpAddress) => {
		saveAction({ localIpAddress: newLocalIpAddress });
	};

	const callback = (status: number, errors: string[] = []) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		user,
		accessToken,
		refreshToken,
		localIpAddress,
		login: loginRequest,
		loginOnline: loginOnlineRequest,
		logout: logoutRequest,
		retrieveUser: retrieveUserRequest,
		updateLocalIpAddress,
		status,
		errors,
	};
};
