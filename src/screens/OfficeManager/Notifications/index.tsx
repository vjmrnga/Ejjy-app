import { Badge, Space, Tabs } from 'antd';
import { Content, NotificationsInfo } from 'components';
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
import { TabDTR } from 'screens/Shared/Notifications/TabDTR';

const tabs = {
	DTR: 'DTR',
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

	const handleTabClick = (tab) => {
		setQueryParams(
			{ tab },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<Content title="Notifications">
			<NotificationsInfo />

			<Box>
				<Tabs
					activeKey={_.toString(currentTab) || tabs.DTR}
					className="PaddingHorizontal PaddingVertical"
					defaultActiveKey={tabs.DTR}
					type="card"
					onTabClick={handleTabClick}
				>
					<Tabs.TabPane
						key={tabs.DTR}
						tab={
							<Space align="center">
								<span>{tabs.DTR}</span>
								<Badge count={1} overflowCount={999} />
							</Space>
						}
					>
						<TabDTR />
					</Tabs.TabPane>
				</Tabs>
			</Box>
		</Content>
	);
};
