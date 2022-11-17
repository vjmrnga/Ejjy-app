import { Container } from 'components';
import { useBranches, useSiteSettingsRetrieve } from 'hooks';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Accounts } from 'screens/Shared/Accounts';
import { ViewAccount } from 'screens/Shared/Accounts/ViewAccount';
import { Assignments } from 'screens/Shared/Assignments';
import { Branches } from 'screens/Shared/Branches';
import { ViewBranch } from 'screens/Shared/Branches/ViewBranch';
import { DiscountOptions } from 'screens/Shared/DiscountOptions';
import { PointSystemTags } from 'screens/Shared/PointSystemTags';
import { ProductCategories } from 'screens/Shared/ProductCategories';
import { Products } from 'screens/Shared/Products';
import { SiteSettings } from 'screens/Shared/SiteSettings';
import { BackOrders } from './BackOrders/BackOrders';
import { ViewBackOrder } from './BackOrders/ViewBackOrder';
import { Checkings } from './Checkings/Checkings';
import { ViewChecking } from './Checkings/ViewChecking';
import { Dashboard } from './Dashboard';
import { Notifications } from './Notifications/Notifications';
import { PendingTransactions } from './PendingTransactions/PendingTransactions';
import { ViewPendingTransaction } from './PendingTransactions/ViewPendingTransaction';
import { Reports } from './Reports/Reports';
import { RequisitionSlips } from './RequisitionSlips';
import { ViewDeliveryReceipt } from './RequisitionSlips/ViewDeliveryReceipt';
import { ViewRequisitionSlip } from './RequisitionSlips/ViewRequisitionSlip';
import { ReturnItemSlips } from './ReturnItemSlips/ReturnItemSlips';
import { ViewReturnItemSlip } from './ReturnItemSlips/ViewReturnItemSlip';
import { Users } from './Users';
import { AssignUser } from './Users/AssignUser';

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
		key: 'product-categories',
		name: 'Product Categories',
		activeIcon: require('../../assets/images/icon-product-active.svg'),
		defaultIcon: require('../../assets/images/icon-product.svg'),
		link: '/office-manager/product-categories',
	},
	{
		key: 'point-system-tags',
		name: 'Point System Tags',
		activeIcon: require('../../assets/images/icon-product-active.svg'),
		defaultIcon: require('../../assets/images/icon-product.svg'),
		link: '/office-manager/point-system-tags',
	},
	{
		key: 'branches',
		name: 'Branches',
		activeIcon: require('../../assets/images/icon-branches-active.svg'),
		defaultIcon: require('../../assets/images/icon-branches.svg'),
		link: '/office-manager/branches',
	},
	{
		key: 'users',
		name: 'Users',
		activeIcon: require('../../assets/images/icon-users-active.svg'),
		defaultIcon: require('../../assets/images/icon-users.svg'),
		link: '/office-manager/users',
	},
	{
		key: 'accounts',
		name: 'Accounts',
		activeIcon: require('../../assets/images/icon-users-active.svg'),
		defaultIcon: require('../../assets/images/icon-users.svg'),
		link: '/office-manager/accounts',
	},
	{
		key: 'assignments',
		name: 'Assignments',
		activeIcon: require('../../assets/images/icon-users-active.svg'),
		defaultIcon: require('../../assets/images/icon-users.svg'),
		link: '/office-manager/assignments',
	},
	{
		key: 'discount-options',
		name: 'Discount Options',
		activeIcon: require('../../assets/images/icon-product-active.svg'),
		defaultIcon: require('../../assets/images/icon-product.svg'),
		link: '/office-manager/discount-options',
	},
	{
		key: 'site-settings',
		name: 'Site Settings',
		activeIcon: require('../../assets/images/icon-settings-active.svg'),
		defaultIcon: require('../../assets/images/icon-settings.svg'),
		link: '/office-manager/site-settings',
	},
	// {
	// 	key: 'checking',
	// 	name: 'Checking',
	// 	activeIcon: require('../../assets/images/icon-checking-active.svg'),
	// 	defaultIcon: require('../../assets/images/icon-checking.svg'),
	// 	link: '/office-manager/checkings',
	// },
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
	// {
	// 	key: 'back-orders',
	// 	name: 'Back Orders',
	// 	activeIcon: require('../../assets/images/icon-requisition-slip-active.svg'),
	// 	defaultIcon: require('../../assets/images/icon-requisition-slip.svg'),
	// 	link: '/office-manager/back-orders',
	// },

	// {
	// 	key: 'reports',
	// 	name: 'Reports',
	// 	activeIcon: require('../../assets/images/icon-report-active.svg'),
	// 	defaultIcon: require('../../assets/images/icon-report.svg'),
	// 	link: '/office-manager/reports',
	// },
	// {
	// 	key: 'pending-transactions',
	// 	name: 'Pending Transactions',
	// 	activeIcon: require('../../assets/images/icon-failed-transfers-active.svg'),
	// 	defaultIcon: require('../../assets/images/icon-failed-transfers.svg'),
	// 	link: '/office-manager/pending-transactions',
	// },
	// {
	// 	key: 'notifications',
	// 	name: 'Notifications',
	// 	activeIcon: require('../../assets/images/icon-notifications-active.svg'),
	// 	defaultIcon: require('../../assets/images/icon-notifications.svg'),
	// 	link: '/office-manager/notifications',
	// },
];

const OfficeManager = () => {
	useBranches({
		options: {
			staleTime: 0,
			refetchOnMount: false,
			notifyOnChangeProps: ['data'],
		},
	});
	useSiteSettingsRetrieve();

	return (
		<Container sidebarItems={sidebarItems}>
			<React.Suspense fallback={<div>Loading...</div>}>
				<Switch>
					<Route component={Products} path="/office-manager/products" />

					<Route
						component={ProductCategories}
						path="/office-manager/product-categories"
					/>

					<Route
						component={PointSystemTags}
						path="/office-manager/point-system-tags"
					/>

					<Route component={Branches} path="/office-manager/branches" exact />
					<Route
						component={ViewBranch}
						path="/office-manager/branches/:id"
						exact
					/>

					<Route component={Users} path="/office-manager/users" exact />
					<Route
						component={AssignUser}
						path="/office-manager/users/assign/:id"
						exact
					/>

					<Route component={Accounts} path="/office-manager/accounts" exact />
					<Route
						component={ViewAccount}
						path="/office-manager/accounts/:id"
						exact
					/>

					<Route
						component={Assignments}
						path="/office-manager/assignments"
						exact
					/>

					<Route
						component={DiscountOptions}
						path="/office-manager/discount-options"
					/>

					<Route
						component={SiteSettings}
						path="/office-manager/site-settings"
					/>

					{/* Disabled as of the moment */}
					<Route component={Dashboard} path="/office-manager/dashboard" />

					<Route component={Checkings} path="/office-manager/checkings" exact />
					<Route
						component={ViewChecking}
						path="/office-manager/checkings/:branchId/:id"
						exact
					/>

					<Route
						component={RequisitionSlips}
						path="/office-manager/requisition-slips"
						exact
					/>
					<Route
						component={ViewRequisitionSlip}
						path="/office-manager/requisition-slips/:id"
						exact
					/>
					<Route
						component={ViewDeliveryReceipt}
						path="/office-manager/requisition-slips/delivery-receipt/:id"
					/>

					<Route
						component={ReturnItemSlips}
						path="/office-manager/return-item-slips"
						exact
					/>
					<Route
						component={ViewReturnItemSlip}
						path="/office-manager/return-item-slips/:id"
						exact
					/>

					<Route
						component={BackOrders}
						path="/office-manager/back-orders"
						exact
					/>
					<Route
						component={ViewBackOrder}
						path="/office-manager/back-orders/:id"
						exact
					/>

					<Route
						component={Notifications}
						path="/office-manager/notifications"
					/>
					<Route component={Reports} path="/office-manager/reports" />

					<Route
						component={PendingTransactions}
						path="/office-manager/pending-transactions"
						exact
					/>
					<Route
						component={ViewPendingTransaction}
						path="/office-manager/pending-transactions/:id"
						exact
					/>

					<Redirect to="/office-manager/products" />
				</Switch>
			</React.Suspense>
		</Container>
	);
};

export default OfficeManager;
