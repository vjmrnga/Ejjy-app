/* eslint-disable no-mixed-spaces-and-tabs */
import { Col, Divider, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { DetailsHalf, DetailsRow } from '../..';
import { EMPTY_CELL } from '../../../global/constants';
import {
	formatDateTime,
	formatQuantity,
	getBackOrderStatus,
} from '../../../utils/function';
import { Button, Label } from '../../elements';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Qty Returned', dataIndex: 'qty_returned' },
	{ title: 'Qty Received', dataIndex: 'qty_received' },
	{ title: 'Status', dataIndex: 'status' },
];

interface Props {
	backOrder: any;
	onClose: any;
}

export const ViewBackOrderModal = ({ backOrder, onClose }: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// METHODS
	useEffect(() => {
		setData(
			backOrder.products.map((item) => ({
				name: item.product.name,
				qty_returned: formatQuantity(
					item.product.unit_of_measurement,
					item.quantity_returned,
				),
				qty_received: item?.quantity_received
					? formatQuantity(
							item.product.unit_of_measurement,
							item.quantity_received,
					  )
					: EMPTY_CELL,
				status: getBackOrderStatus(item.status),
			})),
		);
	}, [backOrder]);

	return (
		<Modal
			title="[View] Back Order"
			className="Modal__large Modal__hasFooter"
			footer={[<Button text="Close" onClick={onClose} />]}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<DetailsRow>
				<Col span={24}>
					<DetailsHalf label="ID" value={backOrder.id} />
				</Col>

				<DetailsHalf
					label="Datetime Returned"
					value={
						backOrder.datetime_sent
							? formatDateTime(backOrder.datetime_sent)
							: EMPTY_CELL
					}
				/>
				<DetailsHalf
					label="Datetime Received"
					value={
						backOrder.datetime_received
							? formatDateTime(backOrder.datetime_received)
							: EMPTY_CELL
					}
				/>

				<DetailsHalf
					label="Returned By (branch)"
					value={backOrder.sender.branch.name}
				/>
				<DetailsHalf
					label="Status"
					value={getBackOrderStatus(backOrder.status)}
				/>
			</DetailsRow>

			<Divider dashed />

			<Label label="Products" spacing />

			<Table
				rowKey="key"
				columns={columns}
				dataSource={data}
				scroll={{ x: 800 }}
				pagination={false}
			/>
		</Modal>
	);
};
