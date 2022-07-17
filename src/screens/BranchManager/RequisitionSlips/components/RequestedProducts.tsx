import { Divider, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Box, Label } from '../../../../components/elements';
import '../style.scss';
import {
	RequisitionSlipDetails,
	requisitionSlipDetailsType,
} from './RequisitionSlipDetails';

interface Props {
	requisitionSlip: any;
}

const columns: ColumnsType = [
	{ title: 'Barcode', dataIndex: 'barcode', key: 'barcode' },
	{ title: 'Name', dataIndex: 'name', key: 'name' },
];

export const RequestedProducts = ({ requisitionSlip }: Props) => {
	const [data, setData] = useState([]);

	useEffect(() => {
		if (requisitionSlip) {
			setData(
				requisitionSlip?.products?.map((requestedProduct) => {
					const { product } = requestedProduct;
					const { barcode, textcode, name } = product;

					return {
						barcode: barcode || textcode,
						name,
					};
				}),
			);
		}
	}, [requisitionSlip]);

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
				columns={columns}
				dataSource={data}
				pagination={false}
				scroll={{ y: 250 }}
			/>
		</Box>
	);
};
