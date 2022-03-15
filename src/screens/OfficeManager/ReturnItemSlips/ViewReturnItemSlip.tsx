/* eslint-disable no-mixed-spaces-and-tabs */
import { Col, Divider, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import { request, returnItemSlipsStatuses } from '../../../global/types';
import { useReturnItemSlips } from '../../../hooks/useReturnItemSlips';
import {
	formatDateTime,
	formatQuantity,
	getReturnItemSlipStatus,
} from '../../../utils/function';
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
			title="[VIEW] Return Item Slip"
			rightTitle={`#${returnItemSlipId}`}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
		>
			<Details
				returnItemSlip={returnItemSlip}
				returnItemSlipsStatus={returnItemSlipsStatus}
			/>
			<AdjustmentSlips
				returnItemSlipId={returnItemSlipId}
				returnItemSlip={returnItemSlip}
				retrieveReturnItemSlip={retrieveReturnItemSlipFn}
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
					status: getReturnItemSlipStatus(item.status),
				})),
			);
		}
	}, [returnItemSlip]);

	return (
		<Spin size="large" spinning={returnItemSlipsStatus === request.REQUESTING}>
			<Box className="PaddingHorizontal PaddingVertical">
				<DetailsRow>
					<Col span={24}>
						<DetailsHalf label="ID" value={returnItemSlip?.id} />
					</Col>

					<DetailsHalf
						label="Datetime Returned"
						value={
							returnItemSlip?.datetime_sent
								? formatDateTime(returnItemSlip?.datetime_sent)
								: EMPTY_CELL
						}
					/>
					<DetailsHalf
						label="Datetime Received"
						value={
							returnItemSlip?.datetime_received
								? formatDateTime(returnItemSlip?.datetime_received)
								: EMPTY_CELL
						}
					/>

					<DetailsHalf
						label="Returned By (branch)"
						value={returnItemSlip?.sender.branch.name}
					/>
					<DetailsHalf
						label="Status"
						value={getReturnItemSlipStatus(returnItemSlip?.status)}
					/>
				</DetailsRow>

				<Divider dashed />

				<Label label="Products" spacing />

				<Table
					columns={columns}
					dataSource={requestedProducts}
					scroll={{ x: 800 }}
					pagination={false}
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
				title="Adjustment Slips"
				buttonName="Create Adjustment Slip"
				onCreate={() => {
					setCreateAdjustmentSlipVisible(true);
				}}
				onCreateDisabled={
					returnItemSlip?.status !== returnItemSlipsStatuses.ERROR
				}
			/>

			<AdjustmentSlipsTable
				adjustmentSlips={adjustmentSlips}
				onViewAdjustmentSlip={(adjustmentSlip) => {
					setSelectedAdjustmentSlip(adjustmentSlip);
				}}
				loading={orderSlipAdjustmentSlipsStatus === request.REQUESTING}
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
					onSuccess={() => {
						retrieveReturnItemSlip();
						listReturnItemSlipAdjustmentSlipsFn();
					}}
					onClose={() => setCreateAdjustmentSlipVisible(false)}
				/>
			)}
		</Box>
	);
};
