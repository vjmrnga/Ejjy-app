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
							description={`Current sales tracker value is ${formatInPeso(
								salesTracker.total_sales,
							)}, please reset as soon as possible.`}
							type="warning"
							showIcon
						/>
					))}
			</Spin>
		</Content>
	);
};
