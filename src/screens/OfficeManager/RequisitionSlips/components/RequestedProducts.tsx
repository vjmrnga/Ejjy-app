import { Divider, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { convertToBulk, formatQuantity } from 'utils';
import { QuantitySelect } from '../../../../components';
import { Box, Label } from '../../../../components/elements';
import { quantityTypes } from '../../../../global/types';
import '../style.scss';
import {
	RequisitionSlipDetails,
	requisitionSlipDetailsType,
} from './RequisitionSlipDetails';

interface Props {
	requisitionSlip: any;
}

export const RequestedProducts = ({ requisitionSlip }: Props) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		if (requisitionSlip) {
			setData(
				requisitionSlip?.products?.map((requestedProduct) => {
					const { product, quantity_piece } = requestedProduct;
					const {
						barcode,
						textcode,
						name,
						pieces_in_bulk,
						unit_of_measurement,
					} = product;

					return {
						quantityPiece: formatQuantity({
							unitOfMeasurement: unit_of_measurement,
							quantity: quantity_piece,
						}),
						quantityBulk: convertToBulk(quantity_piece, pieces_in_bulk),
						barcode: barcode || textcode,
						name,
						quantity: formatQuantity({
							unitOfMeasurement: unit_of_measurement,
							quantity: quantity_piece,
						}),
					};
				}),
			);
		}
	}, [requisitionSlip]);

	const handleQuantityTypeChange = useCallback(
		(quantityType) => {
			const formattedRequestedProducts = data.map((requestProduct) => ({
				...requestProduct,
				quantity:
					quantityType === quantityTypes.PIECE
						? requestProduct.quantityPiece
						: requestProduct.quantityBulk,
			}));
			setData(formattedRequestedProducts);
		},
		[data],
	);

	const getColumns = useCallback(
		() => [
			{ title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
			{ title: 'Name', dataIndex: 'name', key: 'name' },
			{
				title: (
					<QuantitySelect
						quantityText="Quantity Requested"
						onQuantityTypeChange={handleQuantityTypeChange}
					/>
				),
				dataIndex: 'quantity',
				key: 'quantity',
			},
		],
		[handleQuantityTypeChange],
	);

	return (
		<Box>
			<RequisitionSlipDetails
				requisitionSlip={requisitionSlip}
				type={requisitionSlipDetailsType.SINGLE_VIEW}
			/>

			<div className="ViewRequisitionSlip_requestedProducts">
				<Divider dashed />
				<Label label="Requested Products" />
			</div>

			<Table
				columns={getColumns()}
				dataSource={data}
				pagination={false}
				scroll={{ y: 250 }}
			/>
		</Box>
	);
};
