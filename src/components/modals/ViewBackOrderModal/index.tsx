import { Descriptions, Divider, Modal, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Button } from 'components/elements';
import { backOrderTypes, EMPTY_CELL, vatTypes } from 'global';
import { useBackOrderRetrieve } from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
	formatDateTime,
	formatQuantity,
	getBackOrderStatus,
} from 'utils/function';

const columnsDamage: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Qty Returned', dataIndex: 'quantityReturned' },
	{ title: 'Qty Received', dataIndex: 'quantityReceived' },
	{ title: 'Status', dataIndex: 'status' },
];

const columnsForReturn: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Type', dataIndex: 'type', align: 'center', width: 50 },
	{ title: 'Quantity', dataIndex: 'quantity' },
	{ title: 'Remarks', dataIndex: 'remarks' },
];

interface Props {
	backOrder: any | number;
	onClose: any;
}

export const ViewBackOrderModal = ({ backOrder, onClose }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [backOrderData, setBackOrderData] = useState(null);
	const [title, setTitle] = useState('');
	const [columns, setColumns] = useState([]);

	// CUSTOM HOOKS
	const { data: backOrderRetrieved, isFetching } = useBackOrderRetrieve({
		id: backOrder,
		options: {
			enabled: _.isNumber(backOrder),
		},
	});

	// METHODS
	useEffect(() => {
		const data = _.isNumber(backOrder) ? backOrderRetrieved : backOrder;

		setBackOrderData(data);
		setColumns(
			data?.type === backOrderTypes.DAMAGED ? columnsDamage : columnsForReturn,
		);
		setTitle(
			`[View] ${
				data?.type === backOrderTypes.DAMAGED ? 'Back Order' : 'Stock Out'
			}`,
		);
	}, [backOrderRetrieved, backOrder]);

	useEffect(() => {
		const products = backOrderData?.products || [];

		const formattedProducts = products.map((item) => ({
			key: item.id,
			name: item.product.name,
			quantityReturned: formatQuantity(
				item.product.unit_of_measurement,
				item.quantity_returned,
			),
			quantityReceived: item?.quantity_received
				? formatQuantity(
						item.product.unit_of_measurement,
						item.quantity_received,
				  )
				: EMPTY_CELL,
			status: getBackOrderStatus(item.status),

			type: item.product.is_vat_exempted
				? vatTypes.VAT_EMPTY
				: vatTypes.VATABLE,
			quantity: formatQuantity(
				item.product.unit_of_measurement,
				item.quantity_returned,
			),
			remarks: item.remarks,
		}));

		setDataSource(formattedProducts);
	}, [backOrderData]);

	return (
		<Modal
			title={title}
			className="Modal__large Modal__hasFooter"
			footer={[<Button text="Close" onClick={onClose} />]}
			onCancel={onClose}
			visible
			centered
			closable
		>
			<Spin spinning={isFetching}>
				{backOrderData?.type === backOrderTypes.DAMAGED && (
					<Descriptions
						labelStyle={{
							width: 200,
						}}
						bordered
						className="w-100"
						column={2}
						size="small"
					>
						<Descriptions.Item span={2} label="ID">
							{backOrderData.id}
						</Descriptions.Item>

						<Descriptions.Item label="Datetime Returned">
							{backOrderData.datetime_sent
								? formatDateTime(backOrderData.datetime_sent)
								: EMPTY_CELL}
						</Descriptions.Item>
						<Descriptions.Item label="Datetime Received">
							{backOrderData.datetime_received
								? formatDateTime(backOrderData.datetime_received)
								: EMPTY_CELL}
						</Descriptions.Item>

						<Descriptions.Item label="Returned By (Branch)">
							{backOrderData?.sender?.branch?.name || EMPTY_CELL}
						</Descriptions.Item>
						<Descriptions.Item label="Status">
							{getBackOrderStatus(backOrderData.status)}
						</Descriptions.Item>
					</Descriptions>
				)}

				{backOrderData?.type === backOrderTypes.FOR_RETURN && (
					<Descriptions
						labelStyle={{
							width: 200,
						}}
						bordered
						className="w-100"
						column={1}
						size="small"
					>
						<Descriptions.Item label="ID">{backOrderData.id}</Descriptions.Item>
						<Descriptions.Item label="Date & Time Created">
							{formatDateTime(backOrderData.datetime_created)}
						</Descriptions.Item>
						<Descriptions.Item label="Overall Remarks">
							{backOrderData.overall_remarks}
						</Descriptions.Item>
					</Descriptions>
				)}

				<Divider dashed />

				<Table
					columns={columns}
					dataSource={dataSource}
					scroll={{ x: 800 }}
					pagination={false}
					bordered
				/>
			</Spin>
		</Modal>
	);
};
