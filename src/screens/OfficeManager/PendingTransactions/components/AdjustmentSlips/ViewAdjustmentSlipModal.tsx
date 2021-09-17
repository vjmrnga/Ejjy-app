import { Divider, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { DetailsRow, DetailsSingle } from '../../../../../components';
import { Button, Label } from '../../../../../components/elements';
import { formatDateTime, formatQuantity } from '../../../../../utils/function';

const columns: ColumnsType = [
	{ title: 'Code', dataIndex: 'code' },
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
		title="View Adjustment Slip"
		className="Modal__large Modal__hasFooter"
		footer={[<Button key="close" text="Close" onClick={onClose} />]}
		onCancel={onClose}
		visible
		centered
		closable
	>
		<DetailsRow>
			<DetailsSingle
				label="Date & Time Created"
				value={formatDateTime(adjustmentSlip?.datetime_created)}
			/>
			<DetailsSingle label="Remark" value={adjustmentSlip?.remarks} />
		</DetailsRow>

		<Divider dashed />

		<Label label="Products" spacing />
		<Table
			rowKey="key"
			columns={columns}
			dataSource={adjustmentSlip.adjustment_slip_products.map((item) => ({
				key: item.order_slip_adjustment_slip_id,
				code: item.order_slip_product.product.name,
				name:
					item.order_slip_product.product.barcode ||
					item.order_slip_product.product.textcode,
				previous_quantity: formatQuantity(
					item.order_slip_product.product.unit_of_measurement,
					item.previous_fulfilled_quantity_piece,
				),
				new_quantity: formatQuantity(
					item.order_slip_product.product.unit_of_measurement,
					item.new_fulfilled_quantity_piece,
				),
			}))}
			scroll={{ x: 800 }}
			pagination={false}
		/>
	</Modal>
);
