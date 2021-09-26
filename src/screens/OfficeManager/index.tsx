import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from '../../components';
import { request } from '../../global/types';
import { useBranches } from '../../hooks/useBranches';
import { Branches } from '../Shared/Branches/Branches';
import { ViewBranch } from '../Shared/Branches/ViewBranch';
import { Products } from '../Shared/Products/Products';
import { BackOrders } from './BackOrders/BackOrders';
import { ViewBackOrder } from './BackOrders/ViewBackOrder';
import { Checkings } from './Checkings/Checkings';
import { ViewChecking } from './Checkings/ViewChecking';
import { Dashboard } from './Dashboard/Dashboard';
import { Notifications } from './Notifications/Notifications';
import { PendingTransactions } from './PendingTransactions/PendingTransactions';
import { ViewPendingTransaction } from './PendingTransactions/ViewPendingTransaction';
import { Reports } from './Reports/Reports';
import { RequisitionSlips } from './RequisitionSlips/RequisitionSlips';
import { ViewDeliveryReceipt } from './RequisitionSlips/ViewDeliveryReceipt';
import { ViewRequisitionSlip } from './RequisitionSlips/ViewRequisitionSlip';
import { ReturnItemSlips } from './ReturnItemSlips/ReturnItemSlips';
import { ViewReturnItemSlip } from './ReturnItemSlips/ViewReturnItemSlip';
import { AssignUser } from './Users/AssignUser';
import { Users } from './Users/Users';

const sidebarItems = [
	{
		key: 'dashboard',
		name: 'Dashboard',
		activeIcon: require('../../assets/images/icon-dashboard-active.svg'),
		defaultIcon: require('../../assets/images/icon-dashboard.svg'),
		link: '/office-manager/dashboard',
	},
	{
		key: 'products',
		name: 'Products',
		activeIcon: require('../../assets/images/icon-product-active.svg'),
		defaultIcon: require('../../assets/images/icon-product.svg'),
		link: '/office-manager/products',
	},
	{
		key: 'branches',
		name: 'Branches',
		activeIcon: require('../../assets/images/icon-branches-active.svg'),
		defaultIcon: require('../../assets/images/icon-branches.svg'),
		link: '/office-manager/branches',
	},
	{
		key: 'checking',
		name: 'Checking',
		activeIcon: require('../../assets/images/icon-checking-active.svg'),
		defaultIcon: require('../../assets/images/icon-checking.svg'),
		link: '/office-manager/checkings',
	},
	{
		key: 'requisition-slips',
		name: 'Requisition Slips',
		activeIcon: require('../../assets/images/icon-requisition-slip-active.svg'),
		defaultIcon: require('../../assets/images/icon-requisition-slip.svg'),
		link: '/office-manager/requisition-slips',
	},
	{
		key: 'return-item-slips',
		name: 'Return Item Slips',
		activeIcon: require('../../assets/images/icon-requisition-slip-active.svg'),
		defaultIcon: require('../../assets/images/icon-requisition-slip.svg'),
		link: '/office-manager/return-item-slips',
	},
	{
		key: 'back-orders',
		name: 'Back Orders',
		activeIcon: require('../../assets/images/icon-requisition-slip-active.svg'),
		defaultIcon: require('../../assets/images/icon-requisition-slip.svg'),
		link: '/office-manager/back-orders',
	},
	{
		key: 'users',
		name: 'Users',
		activeIcon: require('../../assets/images/icon-users-active.svg'),
		defaultIcon: require('../../assets/images/icon-users.svg'),
		link: '/office-manager/users',
	},
	{
		key: 'reports',
		name: 'Reports',
		activeIcon: require('../../assets/images/icon-report-active.svg'),
		defaultIcon: require('../../assets/images/icon-report.svg'),
		link: '/office-manager/reports',
	},
	{
		key: 'pending-transactions',
		name: 'Pending Transactions',
		activeIcon: require('../../assets/images/icon-failed-transfers-active.svg'),
		defaultIcon: require('../../assets/images/icon-failed-transfers.svg'),
		link: '/office-manager/pending-transactions',
	},
	{
		key: 'notifications',
		name: 'Notifications',
		activeIcon: require('../../assets/images/icon-notifications-active.svg'),
		defaultIcon: require('../../assets/images/icon-notifications.svg'),
		link: '/office-manager/notifications',
	},
];

const OfficeManager = () => {
	// CUSTOM HOOKS
	const { getBranches, status: getBranchesStatus } = useBranches();

	// METHODS
	useEffect(() => {
		getBranches();
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
					<Route path="/office-manager/dashboard" component={Dashboard} />

					<Route path="/office-manager/products" component={Products} />

					<Route path="/office-manager/branches" component={Branches} exact />
					<Route
						path="/office-manager/branches/:id"
						component={ViewBranch}
						exact
					/>

					<Route path="/office-manager/checkings" component={Checkings} exact />
					<Route
						path="/office-manager/checkings/:branchId/:id"
						component={ViewChecking}
						exact
					/>

					<Route
						path="/office-manager/requisition-slips"
						component={RequisitionSlips}
						exact
					/>
					<Route
						path="/office-manager/requisition-slips/:id"
						component={ViewRequisitionSlip}
						exact
					/>
					<Route
						path="/office-manager/requisition-slips/delivery-receipt/:id"
						component={ViewDeliveryReceipt}
					/>

					<Route
						path="/office-manager/return-item-slips"
						component={ReturnItemSlips}
						exact
					/>
					<Route
						path="/office-manager/return-item-slips/:id"
						component={ViewReturnItemSlip}
						exact
					/>

					<Route
						path="/office-manager/back-orders"
						component={BackOrders}
						exact
					/>
					<Route
						path="/office-manager/back-orders/:id"
						component={ViewBackOrder}
						exact
					/>

					<Route path="/office-manager/users" exact component={Users} />
					<Route
						path="/office-manager/users/assign/:id"
						component={AssignUser}
						exact
					/>
					<Route
						path="/office-manager/notifications"
						component={Notifications}
					/>
					<Route path="/office-manager/reports" component={Reports} />

					<Route
						path="/office-manager/pending-transactions"
						component={PendingTransactions}
						exact
					/>
					<Route
						path="/office-manager/pending-transactions/:id"
						component={ViewPendingTransaction}
						exact
					/>

					<Redirect to="/office-manager/dashboard" />
				</Switch>
			</React.Suspense>
		</Container>
	);
};

export default OfficeManager;
