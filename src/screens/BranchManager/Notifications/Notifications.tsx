import { Alert, Spin } from 'antd';
import { Content, RequestErrors } from 'components';
import { MAX_PAGE_SIZE } from 'global';
import { useSalesTracker, useSiteSettingsRetrieve } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatInPeso } from 'utils/function';

export const Notifications = () => {
	// STATES
	const [salesTrackerNotifications, setSalesTrackerNotifications] = useState(
		[],
	);

	// CUSTOM HOOKS
	const {
		data: siteSettings,
		isFetching: isSiteSettingsFetching,
		error: siteSettingsError,
	} = useSiteSettingsRetrieve({
		options: {
			refetchOnMount: 'always',
			notifyOnChangeProps: ['data'],
		},
	});
	const {
		data: { salesTrackers },
		isFetching: isSalesTrackerFetching,
		error: salesTrackerError,
	} = useSalesTracker({
		params: {
			page: 1,
			pageSize: MAX_PAGE_SIZE,
		},
	});

	// METHODS
	useEffect(() => {
		if (siteSettings) {
			const thresholdAmount =
				siteSettings?.reset_counter_notification_threshold_amount;
			const thresholdInvoiceNumber =
				siteSettings?.reset_counter_notification_threshold_invoice_number;

			const notifications = [];
			salesTrackers.forEach((salesTracker) => {
				const { total_sales, transaction_count } = salesTracker;
				const totalSales = Number(total_sales);
				const transactionCount = Number(transaction_count);
				const machineName = salesTracker.branch_machine.name;

				if (totalSales >= thresholdAmount) {
					notifications.push(
						<SalesTrackerTotalSalesNotification
							branchMachineName={machineName}
							totalSales={totalSales}
						/>,
					);
				}

				if (transactionCount >= thresholdInvoiceNumber) {
					notifications.push(
						<SalesTrackerInvoiceNotification
							branchMachineName={machineName}
							transactionCount={transactionCount}
						/>,
					);
				}
			});

			setSalesTrackerNotifications(notifications);
		}
	}, [salesTrackers, siteSettings]);

	return (
		<Content className="Notifications" title="Notifications">
			<Spin spinning={isSalesTrackerFetching || isSiteSettingsFetching}>
				<RequestErrors
					errors={[
						...convertIntoArray(salesTrackerError, 'Sales Tracker'),
						...convertIntoArray(siteSettingsError, 'Site Settings'),
					]}
				/>

				{salesTrackerNotifications}
			</Spin>
		</Content>
	);
};

const SalesTrackerTotalSalesNotification = ({
	branchMachineName,
	totalSales,
}) => (
	<Alert
		className="mb-3"
		message="Sales Tracker - Total Sales"
		description={
			<>
				Current total sales in <b>{branchMachineName}</b> is{' '}
				<b>{formatInPeso(totalSales)}</b>. Please reset as soon as possible.
			</>
		}
		type="warning"
		showIcon
	/>
);

const SalesTrackerInvoiceNotification = ({
	branchMachineName,
	transactionCount,
}) => (
	<Alert
		className="mb-3"
		message="Sales Tracker - Invoice"
		description={
			<>
				Current invoice count value in <b>{branchMachineName}</b> is{' '}
				<b>{transactionCount}</b>. Please reset as soon as possible.
			</>
		}
		type="warning"
		showIcon
	/>
);
