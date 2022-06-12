import { Container } from 'components';
import { MAX_PAGE_SIZE } from 'global';
import { useBranches } from 'hooks';
import { usePendingTransactions } from 'hooks/usePendingTransactions';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Branches } from '../Shared/Branches/Branches';
import { ViewBranch } from '../Shared/Branches/ViewBranch';
import { Products } from '../Shared/Products/Products';
import { Dashboard } from './Dashboard/Dashboard';
import { useFailedTransfers } from './hooks/useFailedTransfers';
import { Logs } from './Logs/Logs';
import { Notifications } from './Notifications/Notifications';
import { PendingTransactions } from './PendingTransactions/PendingTransactions';
import { ProductCategories } from './ProductCategories/ProductCategories';
import { Sales } from './Sales/Sales';
import { Users } from './Users/Users';

const POLL_INTERVAL_MS = 10000;

const Admin = () => {
	// STATES
	const [notificationsCount, setNotificationsCount] = useState(0);

	// CUSTOM HOOKS
	const { pendingTransactionsCount, getPendingTransactionsCount } =
		usePendingTransactions();
	const { failedTransfers, getFailedTansferCount } = useFailedTransfers();
	const {
		data: { branches },
	} = useBranches();

	// REFS
	const pendingTransactionsCountRef = useRef(null);
	const notificationsCountRef = useRef(null);

	// METHODS
	useEffect(() => {
		// Pending Transactions Count
		getPendingTransactionsCount({ isPendingApproval: true });
		pendingTransactionsCountRef.current = setInterval(() => {
			getPendingTransactionsCount({ isPendingApproval: true });
		}, POLL_INTERVAL_MS);

		// Notifications Count
		const fetchFailedTransferNotifications = () => {
			branches.forEach(({ id, name }) => {
				getFailedTansferCount({ branchId: id, branchName: name });
			});
		};

		fetchFailedTransferNotifications();
		notificationsCountRef.current = setInterval(() => {
			fetchFailedTransferNotifications();
		}, POLL_INTERVAL_MS);

		return () => {
			clearInterval(pendingTransactionsCountRef.current);
			clearInterval(notificationsCountRef.current);
		};
	}, []);

	useEffect(() => {
		const count = Object.keys(failedTransfers)
			.filter((key) => failedTransfers?.[key]?.count > 0)
			.reduce((prev, key) => (failedTransfers?.[key]?.count || 0) + prev, 0);

		setNotificationsCount(count);
	}, [failedTransfers]);

	const getSidebarItems = useCallback(
		() => [
			{
				key: 'dashboard',
				name: 'Dashboard',
				activeIcon: require('../../assets/images/icon-dashboard-active.svg'),
				defaultIcon: require('../../assets/images/icon-dashboard.svg'),
				link: '/admin/dashboard',
			},
			{
				key: 'users',
				name: 'Users',
				activeIcon: require('../../assets/images/icon-users-active.svg'),
				defaultIcon: require('../../assets/images/icon-users.svg'),
				link: '/admin/users',
			},
			{
				key: 'branches',
				name: 'Branches',
				activeIcon: require('../../assets/images/icon-branches-active.svg'),
				defaultIcon: require('../../assets/images/icon-branches.svg'),
				link: '/admin/branches',
			},
			{
				key: 'products',
				name: 'Products',
				activeIcon: require('../../assets/images/icon-product-active.svg'),
				defaultIcon: require('../../assets/images/icon-product.svg'),
				link: '/admin/products',
			},
			{
				key: 'product-categories',
				name: 'Product Categories',
				activeIcon: require('../../assets/images/icon-product-active.svg'),
				defaultIcon: require('../../assets/images/icon-product.svg'),
				link: '/admin/product-categories',
			},
			{
				key: 'sales',
				name: 'Sales',
				activeIcon: require('../../assets/images/icon-sales-active.svg'),
				defaultIcon: require('../../assets/images/icon-sales.svg'),
				link: '/admin/sales',
			},
			{
				key: 'pending-transactions',
				name: 'Pending Transactions',
				activeIcon: require('../../assets/images/icon-failed-transfers-active.svg'),
				defaultIcon: require('../../assets/images/icon-failed-transfers.svg'),
				link: '/admin/pending-transactions',
				count: pendingTransactionsCount,
			},
			{
				key: 'logs',
				name: 'Logs',
				activeIcon: require('../../assets/images/icon-requisition-slip-active.svg'),
				defaultIcon: require('../../assets/images/icon-requisition-slip.svg'),
				link: '/admin/logs',
			},
			{
				key: 'notifications',
				name: 'Notifications',
				activeIcon: require('../../assets/images/icon-notifications-active.svg'),
				defaultIcon: require('../../assets/images/icon-notifications.svg'),
				link: '/admin/notifications',
				count: notificationsCount,
			},
		],
		[pendingTransactionsCount, notificationsCount],
	);

	return (
		<Container sidebarItems={getSidebarItems()}>
			<React.Suspense fallback={<div>Loading...</div>}>
				<Switch>
					<Route path="/admin/dashboard" component={Dashboard} />
					<Route
						path="/admin/pending-transactions"
						component={PendingTransactions}
					/>
					<Route path="/admin/users" component={Users} />
					<Route path="/admin/branches" exact component={Branches} />
					<Route path="/admin/branches/:id" component={ViewBranch} />
					<Route path="/admin/products" component={Products} />
					<Route
						path="/admin/product-categories"
						component={ProductCategories}
					/>
					<Route path="/admin/logs" component={Logs} />
					<Route path="/admin/sales" component={Sales} />
					<Route path="/admin/notifications" component={Notifications} />

					<Redirect to="/admin/dashboard" />
				</Switch>
			</React.Suspense>
		</Container>
	);
};

export default Admin;
