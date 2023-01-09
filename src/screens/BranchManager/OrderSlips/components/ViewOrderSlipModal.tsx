import { Col, Divider, Modal, Radio, Row, Space } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { convertToBulk, formatQuantity, getColoredText } from 'utils';
import { Button, Label } from '../../../../components/elements';
import { quantityTypes } from '../../../../global/types';
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
				product: {
					barcode,
					textcode,
					name,
					pieces_in_bulk,
					unit_of_measurement,
				},
				assigned_person: { first_name, last_name },
				quantity_piece,
				fulfilled_quantity_piece = 0,
			} = product;
			const fulfilledQuantityPiece = fulfilled_quantity_piece || 0;

			const isFulfilled = fulfilledQuantityPiece > 0;
			const inputted =
				quantityType === quantityTypes.PIECE
					? formatQuantity({
							unitOfMeasurement: unit_of_measurement,
							quantity: fulfilledQuantityPiece,
					  })
					: convertToBulk(fulfilledQuantityPiece, pieces_in_bulk);
			const ordered =
				quantityType === quantityTypes.PIECE
					? formatQuantity({
							unitOfMeasurement: unit_of_measurement,
							quantity: quantity_piece,
					  })
					: convertToBulk(quantity_piece, pieces_in_bulk);

			return {
				code: barcode || textcode,
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
			className="Modal__large Modal__hasFooter"
			footer={[
				<Space key="buttons" size={10}>
					<Button text="Close" onClick={onClose} />
					<Button text="Print" variant="primary" disabled />
				</Space>,
			]}
			title="View Order Slip"
			centered
			closable
			visible
			onCancel={onClose}
		>
			{orderSlip && <OrderSlipDetails orderSlip={orderSlip} />}

			<Divider dashed />

			<Row gutter={[16, 16]}>
				<Col sm={12} span={24}>
					<Label label="Quantity Type" spacing />
					<Radio.Group
						defaultValue={quantityTypes.PIECE}
						options={[
							{ label: 'Piece', value: quantityTypes.PIECE },
							{ label: 'Bulk', value: quantityTypes.BULK },
						]}
						optionType="button"
						onChange={(e) => {
							const { value } = e.target;
							setQuantityType(value);
						}}
					/>
				</Col>

				<Col span={24}>
					<Table
						columns={columns}
						dataSource={data}
						pagination={false}
						scroll={{ x: 650, y: 250 }}
						bordered
					/>
				</Col>
			</Row>
		</Modal>
	);
};
