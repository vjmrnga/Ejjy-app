import { Descriptions, Divider, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Button, Label } from 'components/elements';
import React from 'react';
import { formatDateTime, formatQuantity } from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Previous Fulfilled Quantity', dataIndex: 'previous_quantity' },
	{ title: 'New Fulfilled Quantity', dataIndex: 'new_quantity' },
];

interface Props {
	adjustmentSlip: any;
	onClose: any;
}

export const ViewAdjustmentSlipModal = ({ adjustmentSlip, onClose }: Props) => (
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
			dataSource={adjustmentSlip.adjustment_slip_products.map((item) => ({
				key: item.id,
				name: item.back_order_product.product.name,
				previous_quantity: formatQuantity({
					unitOfMeasurement:
						item.back_order_product.product.unit_of_measurement,
					quantity: item.previous_quantity_received,
				}),
				new_quantity: formatQuantity({
					unitOfMeasurement:
						item.back_order_product.product.unit_of_measurement,
					quantity: item.new_quantity_received,
				}),
			}))}
			pagination={false}
			scroll={{ x: 800 }}
			bordered
		/>
	</Modal>
);
