/* eslint-disable no-mixed-spaces-and-tabs */
import { Col, Divider, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { formatDateTime, formatQuantity, getReturnItemSlipStatus } from 'utils';
import { DetailsHalf, DetailsRow } from '../..';
import { EMPTY_CELL } from '../../../global/constants';
import { Button, Label } from '../../elements';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Qty Returned', dataIndex: 'qty_returned' },
	{ title: 'Qty Received', dataIndex: 'qty_received' },
	{ title: 'Status', dataIndex: 'status' },
];

interface Props {
	returnItemSlip: any;
	onClose: any;
}

export const ViewReturnItemSlipModal = ({ returnItemSlip, onClose }: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// METHODS
	useEffect(() => {
		setData(
			returnItemSlip.products.map((item) => ({
				key: item.id,
				name: item.product.name,
				qty_returned: formatQuantity({
					unitOfMeasurement: item.product.unit_of_measurement,
					quantity: item.quantity_returned,
				}),
				qty_received: item?.quantity_received
					? formatQuantity({
							unitOfMeasurement: item.product.unit_of_measurement,
							quantity: item.quantity_received,
					  })
					: EMPTY_CELL,
				status: getReturnItemSlipStatus(returnItemSlip.status),
			})),
		);
	}, [returnItemSlip]);

	return (
		<Modal
			className="Modal__large Modal__hasFooter"
			footer={[<Button key="button" text="Close" onClick={onClose} />]}
			title="[View] Return Item Slip"
			centered
			closable
			visible
			onCancel={onClose}
		>
			<DetailsRow>
				<Col span={24}>
					<DetailsHalf label="ID" value={returnItemSlip.id} />
				</Col>

				<DetailsHalf
					label="Datetime Returned"
					value={
						returnItemSlip.datetime_sent
							? formatDateTime(returnItemSlip.datetime_sent)
							: EMPTY_CELL
					}
				/>
				<DetailsHalf
					label="Datetime Received"
					value={
						returnItemSlip.datetime_received
							? formatDateTime(returnItemSlip.datetime_received)
							: EMPTY_CELL
					}
				/>

				<DetailsHalf
					label="Returned By (branch)"
					value={returnItemSlip.sender.branch.name}
				/>
				<DetailsHalf
					label="Status"
					value={getReturnItemSlipStatus(returnItemSlip.status)}
				/>
			</DetailsRow>

			<Divider dashed />

			<Label label="Products" spacing />

			<Table
				columns={columns}
				dataSource={data}
				pagination={false}
				scroll={{ x: 800 }}
				bordered
			/>
		</Modal>
	);
};
