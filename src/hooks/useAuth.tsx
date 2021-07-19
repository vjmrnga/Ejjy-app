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

	const loginAction = useActionDispatch(actions.login);
	const loginOnlineAction = useActionDispatch(actions.loginOnline);
	const logoutAction = useActionDispatch(actions.logout);
	const retrieveUserAction = useActionDispatch(actions.retrieveUser);
	const saveAction = useActionDispatch(actions.save);

	const callback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
	};

	const login = (data) => {
		loginAction({ ...data, callback });
	};

	const loginOnline = (data) => {
		loginOnlineAction({ ...data, callback });
	};

	const logout = (id: number) => {
		logoutAction({ id });
	};

	const retrieveUser = (id, loginCount) => {
		retrieveUserAction({ id, loginCount });
	};

	const updateLocalIpAddress = (newLocalIpAddress) => {
		saveAction({ localIpAddress: newLocalIpAddress });
	};

	const updateUserActiveSessionCount = (loggedInUser, count) => {
		saveAction({
			user: {
				...loggedInUser,
				active_online_sessions_count: count,
				active_sessions_count: count,
			},
		});
	};

	return {
		user,
		accessToken,
		refreshToken,
		login,
		loginOnline,
		logout,
		retrieveUser,
		updateLocalIpAddress,
		updateUserActiveSessionCount,
		status,
		errors,
	};
};
