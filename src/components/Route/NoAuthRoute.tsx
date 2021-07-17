import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { userTypes } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';

export const NoAuthRoute = ({ forUserType, ...rest }: any) => {
	const { user } = useAuth();
	const { user_type: userType } = user || {};

	// Redirect to Admin
	if (userType === userTypes.ADMIN) {
		return <Route render={() => <Redirect to="/admin" />} />;
	}

	// Redirect to Office Manager
	if (userType === userTypes.OFFICE_MANAGER) {
		return <Route render={() => <Redirect to="/office-manager" />} />;
	}

	// Redirect to Branch Manager
	if (userType === userTypes.BRANCH_MANAGER) {
		return <Route render={() => <Redirect to="/branch-manager" />} />;
	}

	// Redirect to Branch Personnel
	if (userType === userTypes.BRANCH_PERSONNEL) {
		return <Route render={() => <Redirect to="/branch-personnel" />} />;
	}

	return <Route {...rest} />;
};
