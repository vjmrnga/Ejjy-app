/* eslint-disable no-mixed-spaces-and-tabs */
import { Descriptions, Divider, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Breadcrumb, Content, TableHeader } from 'components';
import { Box, Label } from 'components/elements';
import {
	EMPTY_CELL,
	MAX_PAGE_SIZE,
	request,
	returnItemSlipsStatuses,
} from 'global';
import { useReturnItemSlips } from 'hooks/useReturnItemSlips';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { formatDateTime, formatQuantity, getReturnItemSlipStatus } from 'utils';
import { useReturnItemSlipAdjustmentSlips } from '../hooks/useReturnItemSlipAdjustmentSlips';
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

export const ViewReturnItemSlip = ({ match }: Props) => {
	// VARIABLES
	const returnItemSlipId = match?.params?.id;

	// STATES
	const [returnItemSlip, setReturnItemSlip] = useState(null);

	// CUSTOM HOOKS
	const history = useHistory();
	const { retrieveReturnItemSlip, status: returnItemSlipsStatus } =
		useReturnItemSlips();

	// METHODS
	useEffect(() => {
		if (returnItemSlipId) {
			retrieveReturnItemSlipFn();
		}
	}, [returnItemSlipId]);

	const getBreadcrumbItems = useCallback(
		() => [
			{
				name: 'Return Item Slips',
				link: '/office-manager/return-item-slips',
			},
			{ name: `#${returnItemSlipId}` },
		],
		[returnItemSlipId],
	);

	const retrieveReturnItemSlipFn = () => {
		retrieveReturnItemSlip(returnItemSlipId, ({ status, data }) => {
			if (status === request.SUCCESS) {
				setReturnItemSlip(data);
			} else if (status === request.ERROR) {
				history.replace('/404');
			}
		});
	};

	return (
		<Content
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
			rightTitle={`#${returnItemSlipId}`}
			title="[VIEW] Return Item Slip"
		>
			<Details
				returnItemSlip={returnItemSlip}
				returnItemSlipsStatus={returnItemSlipsStatus}
			/>
			<AdjustmentSlips
				retrieveReturnItemSlip={retrieveReturnItemSlipFn}
				returnItemSlip={returnItemSlip}
				returnItemSlipId={returnItemSlipId}
			/>
		</Content>
	);
};

interface DetailsProps {
	returnItemSlip?: any;
	returnItemSlipsStatus: number;
}

const Details = ({ returnItemSlip, returnItemSlipsStatus }: DetailsProps) => {
	// STATES
	const [requestedProducts, setRequestedProducts] = useState([]);

	// METHODS
	useEffect(() => {
		if (returnItemSlip) {
			setRequestedProducts(
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
					status: getReturnItemSlipStatus(item.status),
				})),
			);
		}
	}, [returnItemSlip]);

	return (
		<Spin spinning={returnItemSlipsStatus === request.REQUESTING}>
			<Box className="pa-6">
				<Descriptions column={2} bordered>
					<Descriptions.Item label="ID" span={2}>
						{returnItemSlip.id}
					</Descriptions.Item>

					<Descriptions.Item label="Datetime Returned">
						{returnItemSlip.datetime_sent
							? formatDateTime(returnItemSlip.datetime_sent)
							: EMPTY_CELL}
					</Descriptions.Item>

					<Descriptions.Item label="Datetime Received">
						{returnItemSlip.datetime_received
							? formatDateTime(returnItemSlip.datetime_received)
							: EMPTY_CELL}
					</Descriptions.Item>

					<Descriptions.Item label="Returned By (branch)">
						{returnItemSlip.sender.branch.name}
					</Descriptions.Item>

					<Descriptions.Item label="Status">
						{getReturnItemSlipStatus(returnItemSlip.status)}
					</Descriptions.Item>
				</Descriptions>

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
	returnItemSlipId: string;
	returnItemSlip?: any;
	retrieveReturnItemSlip: any;
}
const AdjustmentSlips = ({
	returnItemSlipId,
	returnItemSlip,
	retrieveReturnItemSlip,
}: AdjustmentSlipsProps) => {
	// STATE
	const [createAdjustmentSlipVisible, setCreateAdjustmentSlipVisible] =
		useState(false);
	const [selectedAdjustmentSlip, setSelectedAdjustmentSlip] = useState(null);

	// CUSTOM HOOKS
	const {
		adjustmentSlips,
		listReturnItemSlipAdjustmentSlips,
		status: orderSlipAdjustmentSlipsStatus,
	} = useReturnItemSlipAdjustmentSlips();

	useEffect(() => {
		if (returnItemSlipId) {
			listReturnItemSlipAdjustmentSlipsFn();
		}
	}, [returnItemSlipId]);

	const listReturnItemSlipAdjustmentSlipsFn = () => {
		listReturnItemSlipAdjustmentSlips(
			{
				page: 1,
				pageSize: MAX_PAGE_SIZE,
				returnItemSlipId,
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
				onCreateDisabled={
					returnItemSlip?.status !== returnItemSlipsStatuses.ERROR
				}
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
					returnItemSlip={returnItemSlip}
					onClose={() => setCreateAdjustmentSlipVisible(false)}
					onSuccess={() => {
						retrieveReturnItemSlip();
						listReturnItemSlipAdjustmentSlipsFn();
					}}
				/>
			)}
		</Box>
	);
};
