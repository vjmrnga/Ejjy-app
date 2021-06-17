import { isEmpty } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { selectors } from '../../ducks/auth';

const portal = ['/', '/login'];
const not404Pages = ['/', '/login', '/landing'];

export const CommonRoute = ({ path, exact, component }: any) => {
	const { pathname: pathName } = useLocation();
	const user = useSelector(selectors.selectUser());
	
	if (portal.includes(pathName) && !isEmpty(user)) {
		return <Route render={() => <Redirect to="/landing" />} />;
	}

	if (!portal.includes(pathName) && isEmpty(user)) {
		return <Route render={() => <Redirect to="/" />} />;
	}

	if (!not404Pages.includes(pathName) && !component[user.user_type]) {
		return <Route render={() => <Redirect to="404" />} />;
	}

	return <Route path={path} exact={exact} component={component[user.user_type] || component} />;
};
