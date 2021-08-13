import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { AddButtonIcon } from '../../../../../components';
import { ButtonLink } from '../../../../../components/elements';
import {
	orderSlipStatus as osStatus,
	request,
} from '../../../../../global/types';
import {
	formatDateTime,
	getOrderSlipStatusBranchManager,
} from '../../../../../utils/function';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id', key: 'id' },
	{
		title: 'Date & Time Created',
		dataIndex: 'datetime_created',
		key: 'datetime_created',
	},
	{ title: 'Status', dataIndex: 'status', key: 'status' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

interface Props {
	orderSlips: any;
	orderSlipStatus: any;
	onViewOrderSlip;
	onReceiveDeliveryReceipt: any;
}

export const OrderSlipsTable = ({
	orderSlips,
	orderSlipStatus,
	onViewOrderSlip,
	onReceiveDeliveryReceipt,
}: Props) => {
	const [data, setData] = useState([]);

	// Effect: Format order slips to be rendered in Table
	useEffect(() => {
		if (orderSlipStatus === request.SUCCESS) {
			setData(
				orderSlips.map((orderSlip) => {
					const { id, datetime_created, status } = orderSlip;

					return {
						id: (
							<ButtonLink
								text={id}
								onClick={() => onViewOrderSlip(orderSlip)}
							/>
						),
						datetime_created: formatDateTime(datetime_created),
						status: getOrderSlipStatusBranchManager(
							status.value,
							'RS',
							status.percentage_fulfilled * 100,
						),
						actions:
							status.value === osStatus.DELIVERED ? (
								<AddButtonIcon
									onClick={() => onReceiveDeliveryReceipt(orderSlip)}
									tooltip="Receive"
								/>
							) : null,
					};
				}),
			);
		}
	}, [orderSlips, orderSlipStatus, onReceiveDeliveryReceipt, onViewOrderSlip]);

	return (
		<Table
			columns={columns}
			dataSource={data}
			scroll={{ x: 650 }}
			pagination={false}
			loading={orderSlipStatus === request.REQUESTING}
		/>
	);
};
