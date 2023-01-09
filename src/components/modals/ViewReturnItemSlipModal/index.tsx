import { Descriptions, Divider, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { EMPTY_CELL } from 'global';
import React, { useEffect, useState } from 'react';
import { formatDateTime, formatQuantity, getReturnItemSlipStatus } from 'utils';
import { Button, Label } from '../../elements';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Qty Returned', dataIndex: 'qtyReturned' },
	{ title: 'Qty Received', dataIndex: 'qtyReceived' },
	{ title: 'Status', dataIndex: 'status' },
];

interface Props {
	returnItemSlip: any;
	onClose: any;
}

export const ViewReturnItemSlipModal = ({ returnItemSlip, onClose }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// METHODS
	useEffect(() => {
		const data = returnItemSlip.products.map((item) => ({
			key: item.id,
			name: item.product.name,
			qtyReturned: formatQuantity({
				unitOfMeasurement: item.product.unit_of_measurement,
				quantity: item.quantity_returned,
			}),
			qtyReceived: item?.quantity_received
				? formatQuantity({
						unitOfMeasurement: item.product.unit_of_measurement,
						quantity: item.quantity_received,
				  })
				: EMPTY_CELL,
			status: getReturnItemSlipStatus(returnItemSlip.status),
		}));

		setDataSource(data);
	}, [returnItemSlip]);

	return (
		<Modal
			className="Modal__large Modal__hasFooter"
			footer={[<Button key="button" text="Close" onClick={onClose} />]}
			title="[View] Return Item Slip"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<Descriptions column={2} bordered>
				<Descriptions.Item label="ID" span={2}>
					{returnItemSlip.id}
				</Descriptions.Item>
				<Descriptions.Item label="Datetime Returned">
					{returnItemSlip.datetime_sent
						? formatDateTime(returnItemSlip.datetime_sent)
						: EMPTY_CELL}
				</Descriptions.Item>
				<Descriptions.Item label="Datetime Received">
					{returnItemSlip.datetime_received
						? formatDateTime(returnItemSlip.datetime_received)
						: EMPTY_CELL}
				</Descriptions.Item>
				<Descriptions.Item label="Returned By (branch)">
					{returnItemSlip.sender.branch.name}
				</Descriptions.Item>
				<Descriptions.Item label="Status">
					{getReturnItemSlipStatus(returnItemSlip.status)}
				</Descriptions.Item>
			</Descriptions>

			<Divider dashed />

			<Label label="Products" spacing />

			<Table
				columns={columns}
				dataSource={dataSource}
				pagination={false}
				scroll={{ x: 800 }}
				bordered
			/>
		</Modal>
	);
};
