import { Badge, Space, Tabs } from 'antd';
import { Content } from 'components';
import { Box } from 'components/elements';
import { attendanceCategories, MAX_PAGE_SIZE, serviceTypes } from 'global';
import {
	useAttendanceLogs,
	useBranchProducts,
	useProblematicAttendanceLogs,
	useQueryParams,
	useSalesTracker,
	useSiteSettings,
} from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { TabBranchProducts } from './components/TabBranchProducts';
import { TabDTR } from './components/TabDTR';
import { TabSalesTracker } from './components/TabSalesTracker';

const tabs = {
	BRANCH_PRODUCTS: 'Branch Products',
	DTR: 'DTR',
	SALES_TRACKER: 'Sales Tracker',
};

export const Notifications = () => {
	// CUSTOM HOOKS
	const {
		params: { tab },
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

	const dtrCount = useDtrHooks();
	const salesTrackerCount = useSalesTrackerCount();

	// METHODS
	const handleTabClick = (selectedTab) => {
		setQueryParams(
			{ tab: selectedTab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Notifications">
			<Box>
				<Tabs
					activeKey={tab ? _.toString(tab) : tabs.BRANCH_PRODUCTS}
					className="pa-6"
					type="card"
					destroyInactiveTabPane
					onTabClick={handleTabClick}
				>
					<Tabs.TabPane
						key={tabs.BRANCH_PRODUCTS}
						tab={
							<Space align="center">
								<span>{tabs.BRANCH_PRODUCTS}</span>
								{branchProductsCount > 0 && (
									<Badge count={branchProductsCount} overflowCount={999} />
								)}
							</Space>
						}
					>
						<TabBranchProducts />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.DTR}
						tab={
							<Space align="center">
								<span>{tabs.DTR}</span>
								{dtrCount > 0 && <Badge count={dtrCount} overflowCount={999} />}
							</Space>
						}
					>
						<TabDTR />
					</Tabs.TabPane>

					<Tabs.TabPane
						key={tabs.SALES_TRACKER}
						tab={
							<Space align="center">
								<span>{tabs.SALES_TRACKER}</span>
								{salesTrackerCount > 0 && (
									<Badge count={salesTrackerCount} overflowCount={999} />
								)}
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

const useDtrHooks = () => {
	const params = {
		attendanceCategory: attendanceCategories.ATTENDANCE,
		pageSize: MAX_PAGE_SIZE,
	};

	const { isSuccess: isAttendanceLogsSuccess } = useAttendanceLogs({
		params: {
			...params,
			serviceType: serviceTypes.OFFLINE,
		},
		options: { notifyOnChangeProps: ['isSuccess'] },
	});
	const {
		data: { total: problematicAttendanceLogsCount },
	} = useProblematicAttendanceLogs({
		params,
		options: {
			enabled: isAttendanceLogsSuccess,
			notifyOnChangeProps: ['data'],
		},
	});

	return problematicAttendanceLogsCount;
};

const useSalesTrackerCount = () => {
	// STATES
	const [salesTrackerCount, setSalesTrackerCount] = useState(0);

	// CUSTOM HOOKS
	const { data: siteSettings } = useSiteSettings({
		options: { notifyOnChangeProps: ['data'] },
	});
	const {
		data: { salesTrackers },
	} = useSalesTracker({
		params: { pageSize: MAX_PAGE_SIZE },
		options: { notifyOnChangeProps: ['data'] },
	});

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
			if (newNotificationsCount !== salesTrackerCount) {
				setSalesTrackerCount(newNotificationsCount);
			}
		}
	}, [salesTrackers, siteSettings]);

	return salesTrackerCount;
};
