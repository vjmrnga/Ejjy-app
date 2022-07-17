import { Spin } from 'antd';
import { Container } from 'components';
import { IS_APP_LIVE } from 'global';
import { useBranches } from 'hooks';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Dashboard } from './Dashboard/Dashboard';
import { Notifications } from './Notifications/Notifications';
import { FulfillPreparationSlips } from './PreparationSlips/FulfillPreparationSlip';
import { PreparationSlips } from './PreparationSlips/PreparationSlips';

const sidebarItems = [
	{
		key: 'dashboard',
		name: 'Dashboard',
		activeIcon: require('../../assets/images/icon-dashboard-active.svg'),
		defaultIcon: require('../../assets/images/icon-dashboard.svg'),
		link: '/branch-personnel/dashboard',
	},

	{
		key: 'preparation-slips',
		name: 'Preparation Slips',
		activeIcon: require('../../assets/images/icon-order-slips-active.svg'),
		defaultIcon: require('../../assets/images/icon-order-slips.svg'),
		link: '/branch-personnel/preparation-slips',
	},
	{
		key: 'notifications',
		name: 'Notifications',
		activeIcon: require('../../assets/images/icon-notifications-active.svg'),
		defaultIcon: require('../../assets/images/icon-notifications.svg'),
		link: '/branch-personnel/notifications',
	},
];

const BranchPersonnel = () => {
	// CUSTOM HOOKS
	const { isFetching: isFetchingBranches } = useBranches({
		options: { enabled: IS_APP_LIVE },
	});

	if (isFetchingBranches) {
		return (
			<Spin className="GlobalSpinner" size="large" tip="Fetching data..." />
		);
	}

	return (
		<Container sidebarItems={sidebarItems}>
			<React.Suspense fallback={<div>Loading...</div>}>
				<Switch>
					<Route component={Dashboard} path="/branch-personnel/dashboard" />

					<Route
						component={PreparationSlips}
						path="/branch-personnel/preparation-slips"
						exact
					/>
					<Route
						component={FulfillPreparationSlips}
						path="/branch-personnel/preparation-slips/:id"
						exact
					/>

					<Route
						component={Notifications}
						path="/branch-personnel/notifications"
					/>

					<Redirect to="/branch-personnel/dashboard" />
				</Switch>
			</React.Suspense>
		</Container>
	);
};

export default BranchPersonnel;
