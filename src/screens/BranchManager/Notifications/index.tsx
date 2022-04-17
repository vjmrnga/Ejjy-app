import { Badge, Space, Tabs } from 'antd';
import { Content } from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE } from 'global';
import {
	useBranchProducts,
	useQueryParams,
	useSalesTracker,
	useSiteSettingsRetrieve,
} from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { TabBranchProducts } from './components/TabBranchProducts';
import { TabSalesTracker } from './components/TabSalesTracker';
import './style.scss';

const tabs = {
	BRANCH_PRODUCTS: 'Branch Products',
	SALES_TRACKER: 'Sales Tracker',
};

export const Notifications = () => {
	// STATES
	const [salesTrackerCount, setSalesTrackerCount] = useState(0);

	// CUSTOM HOOKS
	const {
		params: { tab: currentTab },
		setQueryParams,
	} = useQueryParams();
	const {
		data: { total: branchProductsCount },
	} = useBranchProducts({
		params: {
			hasNegativeBalance: true,
			pageSize: MAX_PAGE_SIZE,
		},
		options: { notifyOnChangeProps: ['data'] },
	});
	const { data: siteSettings } = useSiteSettingsRetrieve({
		options: { notifyOnChangeProps: ['data'] },
	});
	const {
		data: { salesTrackers },
	} = useSalesTracker({
		params: { pageSize: MAX_PAGE_SIZE },
		options: { notifyOnChangeProps: ['data'] },
	});

	// METHODS
	useEffect(() => {
		if (!currentTab) {
			onTabClick(tabs.BRANCH_PRODUCTS);
		}
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

			// Set new notification count
			const newNotificationsCount = resetCount + transactionCount;
			if (newNotificationsCount != salesTrackerCount) {
				setSalesTrackerCount(newNotificationsCount);
			}
		}
	}, [salesTrackers, siteSettings]);

	const onTabClick = (tab) => {
		setQueryParams(
			{ tab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Notifications" className="Notifications">
			<Box>
				<Tabs
					type="card"
					className="PaddingHorizontal PaddingVertical"
					activeKey={_.toString(currentTab)}
					onTabClick={onTabClick}
					destroyInactiveTabPane
				>
					<Tabs.TabPane
						key={tabs.BRANCH_PRODUCTS}
						tab={
							<Space align="center">
								<span>{tabs.BRANCH_PRODUCTS}</span>
								<Badge overflowCount={999} count={branchProductsCount} />
							</Space>
						}
					>
						<TabBranchProducts />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.SALES_TRACKER}
						tab={
							<Space align="center">
								<span>{tabs.SALES_TRACKER}</span>
								<Badge overflowCount={999} count={salesTrackerCount} />
							</Space>
						}
					>
						<TabSalesTracker />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
