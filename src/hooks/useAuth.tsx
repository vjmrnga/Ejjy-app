import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors } from '../ducks/auth';
import { request } from '../global/types';
import { IFormValues } from '../screens/_Login/components/LoginForm';
import { useActionDispatch } from './useActionDispatch';

export const useAuth = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	const user = useSelector(selectors.selectUser());
	const accessToken = useSelector(selectors.selectAccessToken());
	const refreshToken = useSelector(selectors.selectRefreshToken());
	const login = useActionDispatch(actions.login);
	const logout = useActionDispatch(actions.logout);
	const retrieveUser = useActionDispatch(actions.retrieveUser);

	const loginRequest = (data: IFormValues) => {
		login({ ...data, callback });
	};

	const logoutRequest = (id: number) => {
		logout({ id });
	};

	const retrieveUserRequest = (id, loginCount) => {
		retrieveUser({ id, loginCount });
	};

	const callback = (status: number, errors: string[] = []) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		user,
		accessToken,
		refreshToken,
		login: loginRequest,
		logout: logoutRequest,
		retrieveUser: retrieveUserRequest,
		status,
		errors,
	};
};
