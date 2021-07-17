import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface Props {
	forUserType: string;
	path: string;
	render?: any;
}

export const CommonRoute = ({ forUserType, ...rest }: Props) => {
	const { user } = useAuth();

	if (user?.user_type === forUserType) {
		return <Route {...rest} />;
	}

	return <Redirect to="/404" />;
};
