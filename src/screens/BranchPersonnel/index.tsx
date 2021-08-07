import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from '../../components';
import { IS_APP_LIVE } from '../../global/constants';
import { request } from '../../global/types';
import { useBranches } from '../../hooks/useBranches';
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
	const { getBranches, status: getBranchesStatus } = useBranches();

	// METHODS
	useEffect(() => {
		if (IS_APP_LIVE) {
			getBranches();
		}
	}, []);

	if (getBranchesStatus === request.REQUESTING) {
		return (
			<Spin className="GlobalSpinner" size="large" tip="Fetching data..." />
		);
	}

	return (
		<Container sidebarItems={sidebarItems}>
			<React.Suspense fallback={<div>Loading...</div>}>
				<Switch>
					<Route path="/branch-personnel/dashboard" component={Dashboard} />

					<Route
						path="/branch-personnel/preparation-slips"
						component={PreparationSlips}
						exact
					/>
					<Route
						path="/branch-personnel/preparation-slips/:id"
						component={FulfillPreparationSlips}
						exact
					/>

					<Route
						path="/branch-personnel/notifications"
						component={Notifications}
					/>

					<Redirect to="/branch-personnel/dashboard" />
				</Switch>
			</React.Suspense>
		</Container>
	);
};

export default BranchPersonnel;
