import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { Container } from '../../components';
import { IS_APP_LIVE } from '../../global/constants';
import { request } from '../../global/types';
import { useAuth } from '../../hooks/useAuth';
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
	const history = useHistory();
	const { user } = useAuth();
	const { getBranches, status: getBranchesStatus } = useBranches();

	useEffect(() => {
		if (user && IS_APP_LIVE) {
			getBranches();
		}
	}, [user]);

	useEffect(() => {
		const requests = [getBranchesStatus];

		if (requests.includes(request.REQUESTING)) {
			// Do nothing
		} else if (requests.every((value) => value === request.SUCCESS)) {
			history.replace('dashboard');
		} else if (requests.some((value) => value === request.ERROR)) {
			// logout(user?.id);
		}
	}, [user, getBranchesStatus]);

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
						exact
						component={PreparationSlips}
					/>
					<Route
						path="/branch-personnel/preparation-slips/:id"
						component={FulfillPreparationSlips}
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
