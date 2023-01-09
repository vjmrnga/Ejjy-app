/* eslint-disable no-mixed-spaces-and-tabs */
import { Col, Divider, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { formatDateTime, formatQuantity, getBackOrderStatus } from 'utils';
import {
	Breadcrumb,
	Content,
	DetailsHalf,
	DetailsRow,
	TableHeader,
} from '../../../components';
import { Box } from '../../../components/elements';
import Label from '../../../components/elements/Label/Label';
import { EMPTY_CELL, MAX_PAGE_SIZE } from '../../../global/constants';
import { backOrdersStatuses, request } from '../../../global/types';
import { useBackOrders } from '../../../hooks/useBackOrders';
import { useBackOrderAdjustmentSlips } from '../hooks/useBackOrderAdjustmentSlips';
import { AdjustmentSlipsTable } from './components/AdjustmentSlips/AdjustmentSlipsTable';
import { CreateAdjustmentSlipModal } from './components/AdjustmentSlips/CreateAdjustmentSlipModal';
import { ViewAdjustmentSlipModal } from './components/AdjustmentSlips/ViewAdjustmentSlipModal';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Qty Returned', dataIndex: 'qty_returned' },
	{ title: 'Qty Received', dataIndex: 'qty_received' },
	{ title: 'Status', dataIndex: 'status' },
];

interface Props {
	match: any;
}

export const ViewBackOrder = ({ match }: Props) => {
	const backOrderId = match?.params?.id;
	// STATES
	const [backOrder, setBackOrder] = useState(null);

	// CUSTOM HOOKS
	const history = useHistory();
	const { retrieveBackOrder, status: backOrdersStatus } = useBackOrders();

	// METHODS
	useEffect(() => {
		if (backOrderId) {
			retrieveBackOrderFn();
		}
	}, [backOrderId]);

	const getBreadcrumbItems = useCallback(
		() => [
			{
				name: 'Back Orders',
				link: '/office-manager/back-orders',
			},
			{ name: `#${backOrderId}` },
		],
		[backOrderId],
	);

	const retrieveBackOrderFn = () => {
		retrieveBackOrder(backOrderId, ({ status, data }) => {
			if (status === request.SUCCESS) {
				setBackOrder(data);
			} else if (status === request.ERROR) {
				history.replace('/404');
			}
		});
	};

	return (
		<Content
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
			rightTitle={`#${backOrderId}`}
			title="[VIEW] Back Order"
		>
			<Details backOrder={backOrder} backOrdersStatus={backOrdersStatus} />
			<AdjustmentSlips
				backOrder={backOrder}
				backOrderId={backOrderId}
				retrieveBackOrder={retrieveBackOrderFn}
			/>
		</Content>
	);
};

interface DetailsProps {
	backOrder?: any;
	backOrdersStatus: number;
}

const Details = ({ backOrder, backOrdersStatus }: DetailsProps) => {
	// STATES
	const [requestedProducts, setRequestedProducts] = useState([]);

	// METHODS
	useEffect(() => {
		if (backOrder) {
			setRequestedProducts(
				backOrder.products.map((item) => ({
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
					status: getBackOrderStatus(item.status),
				})),
			);
		}
	}, [backOrder]);

	return (
		<Spin spinning={backOrdersStatus === request.REQUESTING}>
			<Box className="PaddingHorizontal PaddingVertical">
				<DetailsRow>
					<Col span={24}>
						<DetailsHalf label="ID" value={backOrder?.id} />
					</Col>

					<DetailsHalf
						label="Datetime Returned"
						value={
							backOrder?.datetime_sent
								? formatDateTime(backOrder?.datetime_sent)
								: EMPTY_CELL
						}
					/>
					<DetailsHalf
						label="Datetime Received"
						value={
							backOrder?.datetime_received
								? formatDateTime(backOrder?.datetime_received)
								: EMPTY_CELL
						}
					/>

					<DetailsHalf
						label="Returned By (branch)"
						value={backOrder?.sender.branch.name}
					/>
					<DetailsHalf
						label="Status"
						value={getBackOrderStatus(backOrder?.status)}
					/>
				</DetailsRow>

				<Divider dashed />

				<Label label="Products" spacing />

				<Table
					columns={columns}
					dataSource={requestedProducts}
					pagination={false}
					scroll={{ x: 800 }}
					bordered
				/>
			</Box>
		</Spin>
	);
};

interface AdjustmentSlipsProps {
	backOrderId: string;
	backOrder?: any;
	retrieveBackOrder: any;
}
const AdjustmentSlips = ({
	backOrderId,
	backOrder,
	retrieveBackOrder,
}: AdjustmentSlipsProps) => {
	// STATE
	const [createAdjustmentSlipVisible, setCreateAdjustmentSlipVisible] =
		useState(false);
	const [selectedAdjustmentSlip, setSelectedAdjustmentSlip] = useState(null);

	// CUSTOM HOOKS
	const {
		adjustmentSlips,
		listBackOrderAdjustmentSlips,
		status: orderSlipAdjustmentSlipsStatus,
	} = useBackOrderAdjustmentSlips();

	useEffect(() => {
		if (backOrderId) {
			listBackOrderAdjustmentSlipsFn();
		}
	}, [backOrderId]);

	const listBackOrderAdjustmentSlipsFn = () => {
		listBackOrderAdjustmentSlips(
			{
				page: 1,
				pageSize: MAX_PAGE_SIZE,
				backOrderId,
			},
			true,
		);
	};

	return (
		<Box>
			<TableHeader
				buttonName="Create Adjustment Slip"
				title="Adjustment Slips"
				onCreate={() => {
					setCreateAdjustmentSlipVisible(true);
				}}
				onCreateDisabled={backOrder?.status !== backOrdersStatuses.ERROR}
			/>

			<AdjustmentSlipsTable
				adjustmentSlips={adjustmentSlips}
				loading={orderSlipAdjustmentSlipsStatus === request.REQUESTING}
				onViewAdjustmentSlip={(adjustmentSlip) => {
					setSelectedAdjustmentSlip(adjustmentSlip);
				}}
			/>

			{selectedAdjustmentSlip && (
				<ViewAdjustmentSlipModal
					adjustmentSlip={selectedAdjustmentSlip}
					onClose={() => setSelectedAdjustmentSlip(null)}
				/>
			)}

			{createAdjustmentSlipVisible && (
				<CreateAdjustmentSlipModal
					backOrder={backOrder}
					onClose={() => setCreateAdjustmentSlipVisible(false)}
					onSuccess={() => {
						retrieveBackOrder();
						listBackOrderAdjustmentSlipsFn();
					}}
				/>
			)}
		</Box>
	);
};
