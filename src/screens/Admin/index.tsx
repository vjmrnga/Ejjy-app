import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from '../../components';
import { request } from '../../global/types';
import { useBranches } from '../../hooks/useBranches';
import { usePendingTransactions } from '../../hooks/usePendingTransactions';
import { Branches } from '../Shared/Branches/Branches';
import { ViewBranch } from '../Shared/Branches/ViewBranch';
import { Products } from '../Shared/Products/Products';
import { Dashboard } from './Dashboard/Dashboard';
import { useFailedTransfers } from './hooks/useFailedTransfers';
import { useUpdateBranchProductBalanceLogs } from './hooks/useUpdateBranchProductBalanceLogs';
import { Logs } from './Logs/Logs';
import { Notifications } from './Notifications/Notifications';
import { PendingTransactions } from './PendingTransactions/PendingTransactions';
import { Sales } from './Sales/Sales';

const POLL_INTERVAL_MS = 5000;

const Admin = () => {
	// STATES
	const [logsCount, setLogsCount] = useState(0);
	const [notificationsCount, setNotificationsCount] = useState(0);

	// CUSTOM HOOKS
	const { getUpdateBranchProductBalanceLogs } =
		useUpdateBranchProductBalanceLogs();
	const { pendingTransactionsCount, getPendingTransactionsCount } =
		usePendingTransactions();
	const { failedTransfers, getFailedTansferCount } = useFailedTransfers();
	const { branches } = useBranches();

	// REFS
	const pendingTransactionsCountRef = useRef(null);
	const logsCountRef = useRef(null);
	const notificationsCountRef = useRef(null);

	// METHODS
	useEffect(() => {
		// Pending Transactions Count
		getPendingTransactionsCount();
		pendingTransactionsCountRef.current = setInterval(() => {
			getPendingTransactionsCount();
		}, POLL_INTERVAL_MS);

		// Logs Count
		const fetchLogsCount = () => {
			getUpdateBranchProductBalanceLogs(({ status, data }) => {
				if (status === request.SUCCESS) {
					setLogsCount(data);
				}
			});
		};

		fetchLogsCount();
		logsCountRef.current = setInterval(() => {
			fetchLogsCount();
		}, POLL_INTERVAL_MS);

		// Notifications Coun
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
			clearInterval(logsCountRef.current);
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
				key: 'pending-transactions',
				name: 'Pending Transactions',
				activeIcon: require('../../assets/images/icon-failed-transfers-active.svg'),
				defaultIcon: require('../../assets/images/icon-failed-transfers.svg'),
				link: '/admin/pending-transactions',
				count: pendingTransactionsCount,
			},
			{
				key: 'products',
				name: 'Products',
				activeIcon: require('../../assets/images/icon-product-active.svg'),
				defaultIcon: require('../../assets/images/icon-product.svg'),
				link: '/admin/products',
			},
			{
				key: 'branches',
				name: 'Branches',
				activeIcon: require('../../assets/images/icon-branches-active.svg'),
				defaultIcon: require('../../assets/images/icon-branches.svg'),
				link: '/admin/branches',
			},
			{
				key: 'logs',
				name: 'Logs',
				activeIcon: require('../../assets/images/icon-requisition-slip-active.svg'),
				defaultIcon: require('../../assets/images/icon-requisition-slip.svg'),
				link: '/admin/logs',
				count: logsCount,
			},
			{
				key: 'sales',
				name: 'Sales',
				activeIcon: require('../../assets/images/icon-sales-active.svg'),
				defaultIcon: require('../../assets/images/icon-sales.svg'),
				link: '/admin/sales',
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
		[pendingTransactionsCount, logsCount, notificationsCount],
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
					<Route path="/admin/products" component={Products} />
					<Route path="/admin/branches" exact component={Branches} />
					<Route path="/admin/branches/:id" component={ViewBranch} />
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
