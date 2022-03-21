import { Alert, Spin } from 'antd';
import React from 'react';
import { Content, RequestErrors } from '../../../components';
import {
	MAX_PAGE_SIZE,
	SALES_TRACKER_NOTIFICATION_THRESHOLD,
} from '../../../global/constants';
import { useSalesTracker } from '../../../hooks';
import { convertIntoArray, formatInPeso } from '../../../utils/function';
import './style.scss';

export const Notifications = () => {
	// CUSTOM HOOKS
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

	return (
		<Content className="Notifications" title="Notifications">
			<Spin spinning={isSalesTrackerFetching}>
				<RequestErrors errors={convertIntoArray(salesTrackerError)} />

				{salesTrackers
					.filter(
						({ total_sales }) =>
							Number(total_sales) >= SALES_TRACKER_NOTIFICATION_THRESHOLD,
					)
					.map((salesTracker) => (
						<Alert
							message="Sales Tracker"
							description={
								<span>
									Current sales tracker value in{' '}
									<b>{salesTracker.branch_machine.name}</b> is{' '}
									<b>{formatInPeso(salesTracker.total_sales)}</b>. Please reset
									as soon as possible.
								</span>
							}
							type="warning"
							showIcon
						/>
					))}
			</Spin>
		</Content>
	);
};
