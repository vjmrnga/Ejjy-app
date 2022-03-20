import { Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from '../../components';
import {
	IS_APP_LIVE,
	MAX_PAGE_SIZE,
	SALES_TRACKER_NOTIFICATION_THRESHOLD,
} from '../../global/constants';
import { request } from '../../global/types';
import { useSalesTracker } from '../../hooks';
import { useBranches } from '../../hooks/useBranches';
import { ProductCategories } from '../Shared/ProductCategories/ProductCategories';
import { Products } from '../Shared/Products/Products';
import { Accounts } from './Accounts';
import { BackOrders } from './BackOrders/BackOrders';
import { CreateBackOrder } from './BackOrders/CreateBackOrder';
import { BranchMachines } from './BranchMachines/BranchMachines';
import { ViewBranchMachine } from './BranchMachines/ViewBranchMachine';
import { Checking } from './Checking/Checking';
import { Dashboard } from './Dashboard/Dashboard';
import { Notifications } from './Notifications/Notifications';
import { OrderSlips } from './OrderSlips/OrderSlips';
import { CreateRequisitionSlip } from './RequisitionSlips/CreateRequisitionSlip';
import { RequisitionSlips } from './RequisitionSlips/RequisitionSlips';
import { ViewRequisitionSlip } from './RequisitionSlips/ViewRequisitionSlip';
import { CreateReturnItemSlip } from './ReturnItemSlips/CreateReturnItemSlip';
import { ReturnItemSlips } from './ReturnItemSlips/ReturnItemSlips';
import { SiteSettings } from './SiteSettings/SiteSettings';
import { AssignUser } from './Users/AssignUser';
import { Users } from './Users/Users';

const BranchManager = () => {
	// STATES
	const [notificationsCount, setNotificationsCount] = useState(0);

	// CUSTOM HOOKS
	const { getBranches, status: getBranchesStatus } = useBranches();
	const {
		data: { salesTrackers },
	} = useSalesTracker({
		params: {
			page: 1,
			pageSize: MAX_PAGE_SIZE,
		},
		options: {
			refetchInterval: 60000,
			refetchIntervalInBackground: true,
			notifyOnChangeProps: ['data'],
		},
	});

	// METHODS
	useEffect(() => {
		if (IS_APP_LIVE) {
			getBranches();
		}
	}, []);

	useEffect(() => {
		const salesTrackersCount = salesTrackers.filter(
			({ total_sales }) =>
				Number(total_sales) >= SALES_TRACKER_NOTIFICATION_THRESHOLD,
		).length;

		if (salesTrackersCount != notificationsCount) {
			setNotificationsCount(salesTrackersCount);
		}
	}, [salesTrackers]);

	const getSidebarItems = useCallback(
		() => [
			{
				key: 'dashboard',
				name: 'Dashboard',
				activeIcon: require('../../assets/images/icon-dashboard-active.svg'),
				defaultIcon: require('../../assets/images/icon-dashboard.svg'),
				link: '/branch-manager/dashboard',
			},
			{
				key: 'products',
				name: 'Products',
				activeIcon: require('../../assets/images/icon-product-active.svg'),
				defaultIcon: require('../../assets/images/icon-product.svg'),
				link: '/branch-manager/products',
			},
			{
				key: 'product-categories',
				name: 'Product Categories',
				activeIcon: require('../../assets/images/icon-product-active.svg'),
				defaultIcon: require('../../assets/images/icon-product.svg'),
				link: '/branch-manager/product-categories',
			},
			{
				key: 'users',
				name: 'Users',
				activeIcon: require('../../assets/images/icon-users-active.svg'),
				defaultIcon: require('../../assets/images/icon-users.svg'),
				link: '/branch-manager/users',
			},
			{
				key: 'accounts',
				name: 'Accounts',
				activeIcon: require('../../assets/images/icon-users-active.svg'),
				defaultIcon: require('../../assets/images/icon-users.svg'),
				link: '/branch-manager/accounts',
			},
			{
				key: 'branch-machines',
				name: 'Branch Machines',
				activeIcon: require('../../assets/images/icon-branches-active.svg'),
				defaultIcon: require('../../assets/images/icon-branches.svg'),
				link: '/branch-manager/branch-machines',
			},
			{
				key: 'requisition-slips',
				name: 'Requisition Slips',
				activeIcon: require('../../assets/images/icon-requisition-slip-active.svg'),
				defaultIcon: require('../../assets/images/icon-requisition-slip.svg'),
				link: '/branch-manager/requisition-slips',
			},
			{
				key: 'return-item-slips',
				name: 'Return Item Slips',
				activeIcon: require('../../assets/images/icon-requisition-slip-active.svg'),
				defaultIcon: require('../../assets/images/icon-requisition-slip.svg'),
				link: '/branch-manager/return-item-slips',
			},
			{
				key: 'back-orders',
				name: 'Back Orders',
				activeIcon: require('../../assets/images/icon-requisition-slip-active.svg'),
				defaultIcon: require('../../assets/images/icon-requisition-slip.svg'),
				link: '/branch-manager/back-orders',
			},
			{
				key: 'order-slips',
				name: 'Order Slips',
				activeIcon: require('../../assets/images/icon-order-slips-active.svg'),
				defaultIcon: require('../../assets/images/icon-order-slips.svg'),
				link: '/branch-manager/order-slips',
			},
			{
				key: 'checking',
				name: 'Checking',
				activeIcon: require('../../assets/images/icon-checking-active.svg'),
				defaultIcon: require('../../assets/images/icon-checking.svg'),
				link: '/branch-manager/checking',
			},
			{
				key: 'site-settings',
				name: 'Site Settings',
				activeIcon: require('../../assets/images/icon-settings-active.svg'),
				defaultIcon: require('../../assets/images/icon-settings.svg'),
				link: '/branch-manager/site-settings',
			},
			{
				key: 'notifications',
				name: 'Notifications',
				activeIcon: require('../../assets/images/icon-notifications-active.svg'),
				defaultIcon: require('../../assets/images/icon-notifications.svg'),
				link: '/branch-manager/notifications',
				count: notificationsCount,
			},
		],
		[notificationsCount],
	);

	if (getBranchesStatus === request.REQUESTING) {
		return (
			<Spin className="GlobalSpinner" size="large" tip="Fetching data..." />
		);
	}

	return (
		<Container sidebarItems={getSidebarItems()}>
			<React.Suspense fallback={<div>Loading...</div>}>
				<Switch>
					<Route path="/branch-manager/dashboard" component={Dashboard} />
					<Route
						path="/branch-manager/product-categories"
						component={ProductCategories}
					/>
					<Route path="/branch-manager/products" component={Products} />

					<Route path="/branch-manager/users" exact component={Users} />
					<Route
						path="/branch-manager/users/assign/:id"
						component={AssignUser}
						exact
					/>

					<Route path="/branch-manager/accounts" exact component={Accounts} />

					<Route
						path="/branch-manager/branch-machines"
						component={BranchMachines}
						exact
					/>
					<Route
						path="/branch-manager/branch-machines/:id"
						component={ViewBranchMachine}
						exact
					/>

					<Route
						path="/branch-manager/requisition-slips"
						component={RequisitionSlips}
						exact
					/>
					<Route
						path="/branch-manager/requisition-slips/create"
						component={CreateRequisitionSlip}
						exact
					/>
					<Route
						path="/branch-manager/requisition-slips/:id"
						component={ViewRequisitionSlip}
						exact
					/>

					<Route
						path="/branch-manager/return-item-slips"
						component={ReturnItemSlips}
						exact
					/>
					<Route
						path="/branch-manager/return-item-slips/create"
						component={CreateReturnItemSlip}
						exact
					/>

					<Route
						path="/branch-manager/back-orders"
						component={BackOrders}
						exact
					/>
					<Route
						path="/branch-manager/back-orders/create"
						component={CreateBackOrder}
						exact
					/>

					<Route path="/branch-manager/order-slips" component={OrderSlips} />

					<Route path="/branch-manager/checking" component={Checking} />

					<Route
						path="/branch-manager/notifications"
						component={Notifications}
					/>

					<Route
						path="/branch-manager/site-settings"
						component={SiteSettings}
					/>

					<Redirect to="/branch-manager/dashboard" />
				</Switch>
			</React.Suspense>
		</Container>
	);
};

export default BranchManager;
