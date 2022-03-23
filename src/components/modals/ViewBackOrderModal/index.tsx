/* eslint-disable no-mixed-spaces-and-tabs */
import { Col, Divider, Modal, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { DetailsHalf, DetailsRow } from '../..';
import { EMPTY_CELL } from '../../../global/constants';
import { useBackOrderRetrieve } from '../../../hooks';
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
	backOrder: any | number;
	onClose: any;
}

export const ViewBackOrderModal = ({ backOrder, onClose }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { data: backOrderRetrieved, isFetching } = useBackOrderRetrieve({
		id: backOrder,
		options: {
			enabled: _.isNumber(backOrder),
		},
	});

	// METHODS
	useEffect(() => {
		let products = backOrder.products || [];
		if (backOrderRetrieved?.products) {
			products = backOrderRetrieved.products || [];
		}

		const formattedProducts = products.map((item) => ({
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
		}));

		setDataSource(formattedProducts);
	}, [backOrder, backOrderRetrieved]);

	const backOrderData = _.isNumber(backOrder) ? backOrderRetrieved : backOrder;

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
			<Spin spinning={isFetching}>
				{backOrderData && (
					<DetailsRow>
						<Col span={24}>
							<DetailsHalf label="ID" value={backOrderData.id} />
						</Col>

						<DetailsHalf
							label="Datetime Returned"
							value={
								backOrderData.datetime_sent
									? formatDateTime(backOrderData.datetime_sent)
									: EMPTY_CELL
							}
						/>
						<DetailsHalf
							label="Datetime Received"
							value={
								backOrderData.datetime_received
									? formatDateTime(backOrderData.datetime_received)
									: EMPTY_CELL
							}
						/>

						<DetailsHalf
							label="Returned By (branch)"
							value={backOrderData?.sender?.branch?.name}
						/>
						<DetailsHalf
							label="Status"
							value={getBackOrderStatus(backOrderData.status)}
						/>
					</DetailsRow>
				)}

				<Divider dashed />

				<Label label="Products" spacing />
				<Table
					columns={columns}
					dataSource={dataSource}
					scroll={{ x: 800 }}
					pagination={false}
				/>
			</Spin>
		</Modal>
	);
};
