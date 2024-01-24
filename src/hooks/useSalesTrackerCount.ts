import { MAX_PAGE_SIZE } from 'global';
import useSalesTracker from 'hooks/useSalesTracker';
import { useSiteSettings } from 'hooks/useSiteSettings';
import { useEffect, useState } from 'react';

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

export default useSalesTrackerCount;
