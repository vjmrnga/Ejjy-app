/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Col, Divider, Modal, Radio, Row, Space } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Button, Label } from '../../../../components/elements';
import { quantityTypes } from '../../../../global/types';
import {
	convertToBulk,
	formatQuantity,
	getColoredText,
} from '../../../../utils/function';
import { OrderSlipDetails } from './OrderSlipDetails';

const columns: ColumnsType = [
	{
		title: 'Code',
		dataIndex: 'code',
		width: 150,
		fixed: 'left',
	},
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Quantity', dataIndex: 'quantity' },
	{ title: 'Personnel', dataIndex: 'personnel' },
];

interface Props {
	orderSlip: any;
	onClose: any;
}

export const ViewOrderSlipModal = ({ orderSlip, onClose }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [quantityType, setQuantityType] = useState(quantityTypes.PIECE);

	// METHODS
	useEffect(() => {
		const orderSlipProducts = orderSlip.products.map((product) => {
			const {
				product: { barcode, name, pieces_in_bulk, unit_of_measurement },
				assigned_person: { first_name, last_name },
				quantity_piece,
				fulfilled_quantity_piece = 0,
			} = product;
			const fulfilledQuantityPiece = fulfilled_quantity_piece || 0;

			const isFulfilled = fulfilledQuantityPiece > 0;
			const inputted =
				quantityType === quantityTypes.PIECE
					? formatQuantity(unit_of_measurement, fulfilledQuantityPiece)
					: convertToBulk(fulfilledQuantityPiece, pieces_in_bulk);
			const ordered =
				quantityType === quantityTypes.PIECE
					? formatQuantity(unit_of_measurement, quantity_piece)
					: convertToBulk(quantity_piece, pieces_in_bulk);

			return {
				barcode,
				name,
				quantity: getColoredText(!isFulfilled, inputted, ordered),
				personnel: `${first_name} ${last_name}`,
				ordered,
			};
		});

		setData(orderSlipProducts);
	}, [orderSlip, quantityType]);

	return (
		<Modal
			title="View Order Slip"
			className="Modal__large Modal__hasFooter"
			footer={[
				<Space size={10}>
					<Button text="Close" onClick={onClose} />
					<Button variant="primary" text="Print" disabled />
				</Space>,
			]}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<OrderSlipDetails orderSlip={orderSlip} />

			<Divider dashed />

			<Row gutter={[15, 15]}>
				<Col sm={12} span={24}>
					<Label label="Quantity Type" spacing />
					<Radio.Group
						options={[
							{ label: 'Piece', value: quantityTypes.PIECE },
							{ label: 'Bulk', value: quantityTypes.BULK },
						]}
						onChange={(e) => {
							const { value } = e.target;
							setQuantityType(value);
						}}
						defaultValue={quantityTypes.PIECE}
						optionType="button"
					/>
				</Col>

				<Col span={24}>
					<Table
						columns={columns}
						dataSource={data}
						scroll={{ x: 650, y: 250 }}
						pagination={false}
					/>
				</Col>
			</Row>
		</Modal>
	);
};
