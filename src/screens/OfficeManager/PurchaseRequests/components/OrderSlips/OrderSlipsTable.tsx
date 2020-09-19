import React, { useEffect, useState } from 'react';
import { Table } from '../../../../../components';
import { EMPTY_DR_STATUS } from '../../../../../global/constants';
import { orderSlipStatus as osStatus, request } from '../../../../../global/types';
import {
	calculateTableHeight,
	formatDateTime,
	getOrderSlipStatus,
	sleep,
} from '../../../../../utils/function';
import { OrderSlipActions } from './OrderSlipActions';

const orderSlipsColumns = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'DR Status', dataIndex: 'dr_status' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const OrderSlipsTable = ({
	orderSlips,
	orderSlipStatus,
	onViewOrderSlip,
	onEditOrderSlip,
}) => {
	const [orderSlipsData, setOrderSlipsData] = useState([]);

	// Effect: Format order slips to be rendered in Table
	useEffect(() => {
		if (orderSlipStatus === request.SUCCESS) {
			const formattedOrderSlips = orderSlips.map((orderSlip) => {
				const { id, datetime_created, status } = orderSlip;
				const { value, percentage_fulfilled } = status;

				const onView = value === osStatus.DELIVERED ? () => onViewOrderSlip(orderSlip) : null;
				const onEdit = value === osStatus.PREPARING ? () => onEditOrderSlip(orderSlip) : null;
				const onCreateDR = null;

				return {
					id,
					datetime_created: formatDateTime(datetime_created),
					status: getOrderSlipStatus(value, percentage_fulfilled * 100),
					dr_status: EMPTY_DR_STATUS,
					actions: <OrderSlipActions onView={onView} onEdit={onEdit} onCreateDR={onCreateDR} />,
				};
			});
			sleep(500).then(() => setOrderSlipsData(formattedOrderSlips));
		}
	}, [orderSlips, orderSlipStatus, onViewOrderSlip, onEditOrderSlip]);

	return (
		<Table
			columns={orderSlipsColumns}
			dataSource={orderSlipsData}
			scroll={{ y: calculateTableHeight(orderSlipsData.length), x: '100%' }}
			loading={orderSlipStatus === request.REQUESTING}
		/>
	);
};
