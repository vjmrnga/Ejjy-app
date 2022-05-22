import { Spin } from 'antd';
import { Container, TimeMismatchBoundary } from 'components';
import { IS_APP_LIVE, MAX_PAGE_SIZE, request } from 'global';
import {
	useBranchProducts,
	useProductCheckCreateDaily,
	useProductCheckCreateRandom,
	useSalesTracker,
	useSiteSettingsRetrieve,
} from 'hooks';
import { useBranches } from 'hooks/useBranches';
import React, { useCallback, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ViewAccount } from 'screens/BranchManager/Accounts/ViewAccount';
import { Checkings } from 'screens/BranchManager/Checkings';
import { FulfillChecking } from 'screens/BranchManager/Checkings/Fulfill';
import { ViewChecking } from 'screens/BranchManager/Checkings/ViewChecking';
import { DiscountOptions } from 'screens/BranchManager/DiscountOptions';
import { Logs } from 'screens/BranchManager/Logs';
import { PointSystemTags } from 'screens/BranchManager/PointSystemTags';
import { Reports } from 'screens/BranchManager/Reports';
import { Sales } from 'screens/BranchManager/Sales';
import { Stocks } from 'screens/BranchManager/Stock';
import { CreateStockIn } from 'screens/BranchManager/Stock/components/TabStockIn/CreateStockIn';
import { CreateStockOut } from 'screens/BranchManager/Stock/components/TabStockOut/CreateStockOut';
import { ProductCategories } from '../Shared/ProductCategories/ProductCategories';
import { Products } from '../Shared/Products/Products';
import { Accounts } from './Accounts';
import { BackOrders } from './BackOrders/BackOrders';
import { CreateBackOrder } from './BackOrders/CreateBackOrder';
import { BranchMachines } from './BranchMachines';
import { ViewBranchMachine } from './BranchMachines/ViewBranchMachine';
import { Dashboard } from './Dashboard/Dashboard';
import { Notifications } from './Notifications';
import { OrderSlips } from './OrderSlips/OrderSlips';
import { CreateRequisitionSlip } from './RequisitionSlips/CreateRequisitionSlip';
import { RequisitionSlips } from './RequisitionSlips/RequisitionSlips';
import { ViewRequisitionSlip } from './RequisitionSlips/ViewRequisitionSlip';
import { CreateReturnItemSlip } from './ReturnItemSlips/CreateReturnItemSlip';
import { ReturnItemSlips } from './ReturnItemSlips/ReturnItemSlips';
import { SiteSettings } from './SiteSettings';
import { AssignUser } from './Users/AssignUser';
import { Users } from './Users/Users';

const BranchManager = () => {
	// STATES
	const [notificationsCount, setNotificationsCount] = useState(0);

	// CUSTOM HOOKS
	const { getBranches, status: getBranchesStatus } = useBranches();
	const { data: siteSettings } = useSiteSettingsRetrieve({
		options: {
			refetchInterval: 60000,
			refetchIntervalInBackground: true,
			notifyOnChangeProps: ['data'],
		},
	});
	const {
		data: { total: branchProductsTotal },
	} = useBranchProducts({
		params: {
			hasNegativeBalance: true,
			pageSize: MAX_PAGE_SIZE,
		},
		options: {
			refetchInterval: 60000,
			refetchIntervalInBackground: true,
			notifyOnChangeProps: ['data'],
		},
	});
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
	const { mutate: createCheckDaily } = useProductCheckCreateDaily();
	const { mutate: createCheckRandom } = useProductCheckCreateRandom();

	// METHODS
	useEffect(() => {
		if (IS_APP_LIVE) {
			getBranches();
		}

		createCheckDaily(null);
		createCheckRandom(null);
	}, []);

	useEffect(() => {
		if (siteSettings) {
			const resetCounterNotificationThresholdAmount =
				siteSettings?.reset_counter_notification_threshold_amount;
			const resetCounterNotificationThresholdInvoiceNumber =
				siteSettings?.reset_counter_notification_threshold_invoice_number;

			// Reset count
			const resetCount = salesTrackers.filter(
				({ total_sales }) =>
					Number(total_sales) >= resetCounterNotificationThresholdAmount,
			).length;

			// Transaction count
			const transactionCount = salesTrackers.filter(
				({ transaction_count }) =>
					Number(transaction_count) >=
					resetCounterNotificationThresholdInvoiceNumber,
			).length;

			// Branch products with lacking balance count
			const branchProductCount = branchProductsTotal;

			// Set new notification count
			const newNotificationsCount =
				branchProductCount + resetCount + transactionCount;
			if (newNotificationsCount != notificationsCount) {
				setNotificationsCount(newNotificationsCount);
			}
		}
	}, [branchProductsTotal, salesTrackers, siteSettings]);

	const getSidebarItems = useCallback(
		() => [
			{
				key: 'branch-machines',
				name: 'Branch Machines',
				activeIcon: require('../../assets/images/icon-branches-active.svg'),
				defaultIcon: require('../../assets/images/icon-branches.svg'),
				link: '/branch-manager/branch-machines',
			},
			{
				key: 'reports',
				name: 'Reports',
				activeIcon: require('../../assets/images/icon-report-active.svg'),
				defaultIcon: require('../../assets/images/icon-report.svg'),
				link: '/branch-manager/reports',
			},
			{
				key: 'sales',
				name: 'Sales',
				activeIcon: require('../../assets/images/icon-sales-active.svg'),
				defaultIcon: require('../../assets/images/icon-sales.svg'),
				link: '/branch-manager/sales',
			},
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
				key: 'point-system-tags',
				name: 'Point System Tags',
				activeIcon: require('../../assets/images/icon-product-active.svg'),
				defaultIcon: require('../../assets/images/icon-product.svg'),
				link: '/branch-manager/point-system-tags',
			},
			{
				key: 'product-categories',
				name: 'Product Categories',
				activeIcon: require('../../assets/images/icon-product-active.svg'),
				defaultIcon: require('../../assets/images/icon-product.svg'),
				link: '/branch-manager/product-categories',
			},
			{
				key: 'stocks',
				name: 'Stocks',
				activeIcon: require('../../assets/images/icon-product-active.svg'),
				defaultIcon: require('../../assets/images/icon-product.svg'),
				link: '/branch-manager/stocks',
			},
			{
				key: 'discount-options',
				name: 'Discount Options',
				activeIcon: require('../../assets/images/icon-product-active.svg'),
				defaultIcon: require('../../assets/images/icon-product.svg'),
				link: '/branch-manager/discount-options',
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
				key: 'checkings',
				name: 'Checkings',
				activeIcon: require('../../assets/images/icon-checking-active.svg'),
				defaultIcon: require('../../assets/images/icon-checking.svg'),
				link: '/branch-manager/checkings',
			},
			{
				key: 'site-settings',
				name: 'Site Settings',
				activeIcon: require('../../assets/images/icon-settings-active.svg'),
				defaultIcon: require('../../assets/images/icon-settings.svg'),
				link: '/branch-manager/site-settings',
			},
			{
				key: 'logs',
				name: 'Logs',
				activeIcon: require('../../assets/images/icon-requisition-slip-active.svg'),
				defaultIcon: require('../../assets/images/icon-requisition-slip.svg'),
				link: '/branch-manager/logs',
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
			{!IS_APP_LIVE && <TimeMismatchBoundary />}

			<React.Suspense fallback={<div>Loading...</div>}>
				<Switch>
					<Route path="/branch-manager/dashboard" component={Dashboard} />

					<Route path="/branch-manager/reports" component={Reports} />

					<Route path="/branch-manager/sales" component={Sales} />

					<Route
						path="/branch-manager/product-categories"
						component={ProductCategories}
					/>
					<Route path="/branch-manager/products" component={Products} />

					<Route
						path="/branch-manager/point-system-tags"
						component={PointSystemTags}
					/>

					<Route path="/branch-manager/stocks" component={Stocks} exact />
					<Route
						path="/branch-manager/stocks/stock-in/create"
						component={CreateStockIn}
						exact
					/>
					<Route
						path="/branch-manager/stocks/stock-out/create"
						component={CreateStockOut}
						exact
					/>

					<Route
						path="/branch-manager/discount-options"
						component={DiscountOptions}
					/>

					<Route path="/branch-manager/users" exact component={Users} />
					<Route
						path="/branch-manager/users/assign/:id"
						component={AssignUser}
						exact
					/>

					<Route path="/branch-manager/accounts" exact component={Accounts} />
					<Route
						path="/branch-manager/accounts/:id"
						component={ViewAccount}
						exact
					/>

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

					<Route path="/branch-manager/checkings" component={Checkings} exact />
					<Route
						path="/branch-manager/checkings/fulfill"
						component={FulfillChecking}
						exact
					/>
					<Route
						path="/branch-manager/checkings/:id"
						component={ViewChecking}
						exact
					/>

					<Route
						path="/branch-manager/notifications"
						component={Notifications}
					/>

					<Route path="/branch-manager/logs" component={Logs} />

					<Route
						path="/branch-manager/site-settings"
						component={SiteSettings}
					/>

					<Redirect to="/branch-manager/branch-machines" />
				</Switch>
			</React.Suspense>
		</Container>
	);
};

export default BranchManager;
