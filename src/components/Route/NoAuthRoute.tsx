import { userTypes } from 'global';
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useUserStore } from 'stores';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const NoAuthRoute = ({ forUserType, noRedirects, ...rest }: any) => {
	const user = useUserStore((state) => state.user);

	if (!noRedirects) {
		const userType = user?.user_type;

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
	}

	return <Route {...rest} />;
};
