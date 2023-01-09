import { Descriptions, Divider, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Button, Label } from 'components/elements';
import React, { useEffect, useState } from 'react';
import { formatDateTime, formatQuantity } from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Previous Fulfilled Quantity', dataIndex: 'previousQuantity' },
	{ title: 'New Fulfilled Quantity', dataIndex: 'newQuantity' },
];

interface Props {
	adjustmentSlip: any;
	onClose: any;
}

export const ViewAdjustmentSlipModal = ({ adjustmentSlip, onClose }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// METHODS
	useEffect(() => {
		const data = adjustmentSlip.adjustment_slip_products.map((item) => ({
			key: item.id,
			name: item.return_item_slip_product.product.name,
			previousQuantity: formatQuantity({
				unitOfMeasurement:
					item.return_item_slip_product.product.unit_of_measurement,
				quantity: item.previous_quantity_received,
			}),
			newQuantity: formatQuantity({
				unitOfMeasurement:
					item.return_item_slip_product.product.unit_of_measurement,
				quantity: item.new_quantity_received,
			}),
		}));

		setDataSource(data);
	}, [adjustmentSlip]);

	return (
		<Modal
			className="Modal__large Modal__hasFooter"
			footer={[<Button key="close" text="Close" onClick={onClose} />]}
			title="View Adjustment Slip"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<Descriptions column={1} bordered>
				<Descriptions.Item label="Date & Time Created">
					{formatDateTime(adjustmentSlip?.datetime_created)}
				</Descriptions.Item>
				<Descriptions.Item label="Remark">
					{adjustmentSlip?.remarks}
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
