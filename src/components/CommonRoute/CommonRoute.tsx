import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { selectors } from '../../ducks/auth';

const portal = ['/', '/login'];

const CommonRoute = ({ accessToken, refreshToken, ...rest }: any) => {
	const { pathname: pathName } = useLocation();

	if (portal.includes(pathName) && accessToken && refreshToken) {
		return <Route render={() => <Redirect to="/dashboard" />} />;
	}

	if (!portal.includes(pathName) && (!accessToken || !refreshToken)) {
		return <Route render={() => <Redirect to="/" />} />;
	}

	return <Route {...rest} />;
};

const mapState = createStructuredSelector({
	accessToken: selectors.selectAccessToken(),
	refreshToken: selectors.selectRefreshToken(),
});

const connector = connect(mapState, null);

export default connector(CommonRoute);
