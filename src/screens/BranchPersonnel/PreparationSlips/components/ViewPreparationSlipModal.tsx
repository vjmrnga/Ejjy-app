import { Col, Modal, Radio, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PreparationSlipDetails } from 'components';
import { Button, Label } from 'components/elements';
import { quantityTypes } from 'global';
import React, { useEffect, useState } from 'react';
import { convertToBulk, formatQuantity } from 'utils';

const columns: ColumnsType = [
	{
		title: 'Code',
		dataIndex: 'code',
		width: 150,
		fixed: 'left',
	},
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Quantity', dataIndex: 'quantity' },
];

interface Props {
	preparationSlip: any;
	onClose: any;
}

export const ViewPreparationSlipModal = ({
	preparationSlip,
	onClose,
}: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [quantityType, setQuantityType] = useState(quantityTypes.PIECE);

	// METHODS
	useEffect(() => {
		const preparationSlipProducts = preparationSlip.products.map((product) => {
			const {
				id,
				product: {
					barcode,
					textcode,
					name,
					pieces_in_bulk,
					unit_of_measurement,
				},
				fulfilled_quantity_piece,
			} = product;
			const fulfilledQuantityPiece = fulfilled_quantity_piece || 0;

			const inputted =
				quantityType === quantityTypes.PIECE
					? formatQuantity({
							unitOfMeasurement: unit_of_measurement,
							quantity: fulfilledQuantityPiece,
					  })
					: convertToBulk(fulfilledQuantityPiece, pieces_in_bulk);

			return {
				key: id,
				code: barcode || textcode,
				name,
				quantity: inputted,
			};
		});

		setData(preparationSlipProducts);
	}, [preparationSlip, quantityType]);

	return (
		<Modal
			className="Modal__large Modal__hasFooter"
			footer={[<Button key="button" text="Close" onClick={onClose} />]}
			title="View Preparation Slip"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<PreparationSlipDetails preparationSlip={preparationSlip} />

			<Row align="middle" gutter={[16, 16]} justify="space-between">
				<Col sm={12} span={24}>
					<Label label="Products" spacing />
				</Col>

				<Col sm={12} span={24}>
					<Space direction="horizontal">
						<Label label="Quantity Type" />
						<Radio.Group
							defaultValue={quantityTypes.PIECE}
							options={[
								{ label: 'Piece', value: quantityTypes.PIECE },
								{ label: 'Bulk', value: quantityTypes.BULK },
							]}
							optionType="button"
							onChange={(e) => {
								setQuantityType(e.target.value);
							}}
						/>
					</Space>
				</Col>
			</Row>

			<Table
				columns={columns}
				dataSource={data}
				pagination={false}
				scroll={{ x: 650, y: 250 }}
			/>
		</Modal>
	);
};
