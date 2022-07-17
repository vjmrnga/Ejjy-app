import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDateTime, getOrderSlipStatus } from 'utils';
import { ButtonLink } from '../../../../../components/elements';
import { orderSlipStatus as osStatus } from '../../../../../global/types';
import { OrderSlipActions } from './OrderSlipActions';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id', key: 'id' },
	{
		title: 'Date & Time Created',
		dataIndex: 'datetime_created',
		key: 'datetime_created',
	},
	{ title: 'Status', dataIndex: 'status', key: 'status' },
	{ title: 'DR', dataIndex: 'dr', key: 'dr' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

interface Props {
	orderSlips: any;
	onViewOrderSlip: any;
	onEditOrderSlip: any;
	onCreateDeliveryReceipt: any;
	loading: boolean;
}

export const OrderSlipsTable = ({
	orderSlips,
	onViewOrderSlip,
	onEditOrderSlip,
	onCreateDeliveryReceipt,
	loading,
}: Props) => {
	const [data, setData] = useState([]);

	// Effect: Format order slips to be rendered in Table
	useEffect(() => {
		if (orderSlips) {
			setData(
				orderSlips.map((orderSlip) => {
					const { id, datetime_created, status, delivery_receipt } = orderSlip;

					const deliveryReceipt =
						status.value === osStatus.RECEIVED ? (
							<Link
								to={`/office-manager/requisition-slips/delivery-receipt/${delivery_receipt?.id}`}
							>
								{delivery_receipt?.id}
							</Link>
						) : null;

					const onEdit =
						status.value === osStatus.PREPARING
							? () => onEditOrderSlip(orderSlip)
							: null;

					const onCreateDR =
						status.value === osStatus.PREPARED
							? () => onCreateDeliveryReceipt(id)
							: null;

					return {
						id: (
							<ButtonLink
								text={id}
								onClick={() => onViewOrderSlip(orderSlip)}
							/>
						),
						datetime_created: formatDateTime(datetime_created),
						status: getOrderSlipStatus(
							status.value,
							status.percentage_fulfilled * 100,
							delivery_receipt?.status,
						),
						dr: deliveryReceipt,
						actions: (
							<OrderSlipActions onCreateDR={onCreateDR} onEdit={onEdit} />
						),
					};
				}),
			);
		}
	}, [orderSlips, onEditOrderSlip, onCreateDeliveryReceipt, onViewOrderSlip]);

	return (
		<Table
			columns={columns}
			dataSource={data}
			loading={loading}
			pagination={false}
			scroll={{ x: 650 }}
		/>
	);
};
