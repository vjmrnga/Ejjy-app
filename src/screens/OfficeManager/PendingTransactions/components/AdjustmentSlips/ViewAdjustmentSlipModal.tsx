/* eslint-disable no-mixed-spaces-and-tabs */
import { Descriptions, Divider, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ColoredText } from 'components';
import { Button } from 'components/elements';
import React from 'react';
import { formatDateTime, formatQuantity } from 'utils';
import { DEFAULT_APPROVED_FULFILLED_QUANTITY } from '../constants';

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

		<Divider>Products</Divider>

		<Table
			columns={columns}
			dataSource={adjustmentSlip.adjustment_slip_products.map((item) => ({
				key: item.id,
				name:
					item.order_slip_product.product.barcode ||
					item.order_slip_product.product.textcode,
				previous_quantity: formatQuantity({
					unitOfMeasurement:
						item.order_slip_product.product.unit_of_measurement,
					quantity: item.previous_fulfilled_quantity_piece,
				}),
				new_quantity:
					Number(item.new_fulfilled_quantity_piece) ===
					DEFAULT_APPROVED_FULFILLED_QUANTITY ? (
						<ColoredText text="Approved" variant="primary" />
					) : (
						formatQuantity({
							unitOfMeasurement:
								item.order_slip_product.product.unit_of_measurement,
							quantity: item.new_fulfilled_quantity_piece,
						})
					),
			}))}
			pagination={false}
			scroll={{ x: 800 }}
			bordered
		/>
	</Modal>
);
