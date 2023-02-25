import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useUserStore } from 'stores';

interface Props {
	forUserType: string;
	isLoading: boolean;
	path: string;
	render?: any;
}

export const CommonRoute = ({ forUserType, isLoading, ...rest }: Props) => {
	const user = useUserStore((state) => state.user);

	if (isLoading) {
		return null;
	}

	if (user?.user_type === forUserType) {
		return <Route {...rest} />;
	}

	return <Redirect to="/404" />;
};
