import { Col, Divider, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Table } from '../../../../components';
import { Box, Label } from '../../../../components/elements';
import { request } from '../../../../global/types';
import {
	calculateTableHeight,
	convertToBulk,
	sleep,
} from '../../../../utils/function';
import '../style.scss';
import {
	RequisitionSlipDetails,
	requisitionSlipDetailsType,
} from './RequisitionSlipDetails';

interface Props {
	requisitionSlip: any;
	requisitionSlipStatus: number;
}

const columns = [
	{ title: 'Barcode', dataIndex: 'barcode' },
	{ title: 'Name', dataIndex: 'name' },
];

export const RequestedProducts = ({
	requisitionSlip,
	requisitionSlipStatus,
}: Props) => {
	const [requestedProducts, setRequestedProducts] = useState([]);

	// Effect: Format requested products to be rendered in Table
	useEffect(() => {
		if (requisitionSlip && requisitionSlipStatus === request.SUCCESS) {
			const formattedRequestedProducts = requisitionSlip?.products.map(
				(requestedProduct) => {
					const { product, quantity_piece } = requestedProduct;
					const { barcode, textcode, name, pieces_in_bulk } = product;

					return {
						_quantity_piece: quantity_piece,
						_quantity_bulk: convertToBulk(quantity_piece, pieces_in_bulk),
						barcode: barcode || textcode,
						name,
						// quantity: quantity_piece,
					};
				},
			);

			sleep(500).then(() => setRequestedProducts(formattedRequestedProducts));
		}
	}, [requisitionSlip, requisitionSlipStatus]);

	return (
		<Box>
			<RequisitionSlipDetails
				requisitionSlip={requisitionSlip}
				type={requisitionSlipDetailsType.SINGLE_VIEW}
			/>

			<div className="ViewRequisitionSlip_requestedProducts">
				<Divider dashed />
				<Row gutter={[15, 15]} align="middle">
					<Col span={24}>
						<Label label="Requested Products" />
					</Col>
				</Row>
			</div>

			<Table
				columns={columns}
				dataSource={requestedProducts}
				scroll={{
					y: calculateTableHeight(requestedProducts.length),
					x: '100%',
				}}
			/>
		</Box>
	);
};
