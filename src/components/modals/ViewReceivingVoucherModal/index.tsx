import { Descriptions, Divider, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Button } from 'components/elements';
import { vatTypes } from 'global';
import React, { useEffect, useState } from 'react';
import {
	formatDateTime,
	formatInPeso,
	formatQuantity,
	getFullName,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type', align: 'center', width: 50 },
	{ title: 'Quantity', dataIndex: 'quantity' },
	{ title: 'Cost Per Piece', dataIndex: 'costPerPiece' },
];

interface Props {
	receivingVoucher: any | number;
	onClose: any;
}

export const ViewReceivingVoucherModal = ({
	receivingVoucher,
	onClose,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// METHODS
	useEffect(() => {
		const products = receivingVoucher?.products || [];

		const formattedProducts = products.map((item) => ({
			key: item.id,
			name: item.product.name,
			type: item.product.is_vat_exempted
				? vatTypes.VAT_EMPTY
				: vatTypes.VATABLE,
			quantity: formatQuantity({
				unitOfMeasurement: item.product.unit_of_measurement,
				quantity: item.quantity,
			}),
			costPerPiece: formatInPeso(item.cost_per_piece),
		}));

		setDataSource(formattedProducts);
	}, [receivingVoucher]);

	return (
		<Modal
			className="Modal__large Modal__hasFooter"
			footer={[<Button key="button" text="Close" onClick={onClose} />]}
			title="[View] Receiving Voucher"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<Descriptions
				className="w-100"
				column={2}
				labelStyle={{
					width: 200,
				}}
				size="small"
				bordered
			>
				<Descriptions.Item label="ID">{receivingVoucher.id}</Descriptions.Item>
				<Descriptions.Item label="Datetime Created">
					{formatDateTime(receivingVoucher.datetime_created)}
				</Descriptions.Item>
				<Descriptions.Item label="Supplier Name">
					{receivingVoucher.supplier_name}
				</Descriptions.Item>
				<Descriptions.Item label="Supplier TIN">
					{receivingVoucher.supplier_tin}
				</Descriptions.Item>
				<Descriptions.Item label="Supplier Address" span={2}>
					{receivingVoucher.supplier_address}
				</Descriptions.Item>
				<Descriptions.Item label="Encoded By">
					{getFullName(receivingVoucher.encoded_by)}
				</Descriptions.Item>
				<Descriptions.Item label="Checked By">
					{getFullName(receivingVoucher.checked_by)}
				</Descriptions.Item>
				<Descriptions.Item label="Amount Paid" span={2}>
					{formatInPeso(receivingVoucher.amount_paid)}
				</Descriptions.Item>
			</Descriptions>

			<Divider dashed />

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
