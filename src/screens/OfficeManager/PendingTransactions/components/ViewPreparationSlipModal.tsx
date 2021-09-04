/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Col, Modal, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useEffect, useState } from 'react';
import { PreparationSlipDetails, QuantitySelect } from '../../../../components';
import { Button, Label } from '../../../../components/elements';
import { quantityTypes } from '../../../../global/types';
import { convertToBulk, getColoredText } from '../../../../utils/function';

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
		if (preparationSlip) {
			setData(
				preparationSlip.products.map((product) => {
					const {
						product: { barcode, textcode, name, pieces_in_bulk },
						assigned_person: { first_name, last_name },
						quantity_piece,
						fulfilled_quantity_piece,
					} = product;
					const fulfilledQuantityPiece = fulfilled_quantity_piece || 0;

					const inputted =
						quantityType === quantityTypes.PIECE
							? fulfilledQuantityPiece
							: convertToBulk(fulfilledQuantityPiece, pieces_in_bulk);
					const ordered =
						quantityType === quantityTypes.PIECE
							? quantity_piece
							: convertToBulk(quantity_piece, pieces_in_bulk);

					return {
						code: barcode || textcode,
						name,
						quantity: getColoredText(false, inputted, ordered),
						personnel: `${first_name} ${last_name}`,
						ordered,
					};
				}),
			);
		}
	}, [preparationSlip, quantityType]);

	const getColumns = useCallback(
		(): ColumnsType => [
			{
				title: 'Code',
				dataIndex: 'code',
				width: 150,
				fixed: 'left',
			},

			{ title: 'Name', dataIndex: 'name' },
			{
				title: <QuantitySelect onQuantityTypeChange={setQuantityType} />,
				dataIndex: 'quantity',
			},
			{ title: 'Personnel', dataIndex: 'personnel' },
		],
		[],
	);

	return (
		<Modal
			className="Modal__large Modal__hasFooter"
			title="View Pending Order Slip"
			footer={[<Button text="Close" onClick={onClose} />]}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<PreparationSlipDetails preparationSlip={preparationSlip} />

			<Row gutter={[15, 15]} align="middle">
				<Col span={24}>
					<Label label="Requested Products" spacing />
				</Col>
				<Col span={24}>
					<Table
						rowKey="key"
						columns={getColumns()}
						dataSource={data}
						scroll={{ x: 650 }}
						pagination={false}
					/>
				</Col>
			</Row>
		</Modal>
	);
};
