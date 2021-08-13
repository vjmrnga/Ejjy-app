import { Divider, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { QuantitySelect } from '../../../../components';
import { Box, Label } from '../../../../components/elements';
import { quantityTypes } from '../../../../global/types';
import { convertToBulk } from '../../../../utils/function';
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
					const { barcode, textcode, name, pieces_in_bulk } = product;

					return {
						quantityPiece: quantity_piece,
						quantityBulk: convertToBulk(quantity_piece, pieces_in_bulk),
						barcode: barcode || textcode,
						name,
						quantity: quantity_piece,
					};
				}),
			);
		}
	}, [requisitionSlip]);

	const onQuantityTypeChange = useCallback(
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
						onQuantityTypeChange={onQuantityTypeChange}
					/>
				),
				dataIndex: 'quantity',
				key: 'quantity',
			},
		],
		[onQuantityTypeChange],
	);

	return (
		<Box>
			<RequisitionSlipDetails
				className="PaddingHorizontal PaddingVertical"
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
				scroll={{ y: 250 }}
				pagination={false}
			/>
		</Box>
	);
};
