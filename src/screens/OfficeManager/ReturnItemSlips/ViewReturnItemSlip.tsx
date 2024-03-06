/* eslint-disable no-mixed-spaces-and-tabs */
import { Descriptions, Divider, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Breadcrumb, Content, RequestErrors, TableHeader } from 'components';
import { Box, Label } from 'components/elements';
import {
	EMPTY_CELL,
	MAX_PAGE_SIZE,
	request,
	returnItemSlipsStatuses,
} from 'global';
import { useReturnItemSlipRetrieve } from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatDateTime,
	formatQuantity,
	getReturnItemSlipStatus,
} from 'utils';
import { useReturnItemSlipAdjustmentSlips } from '../hooks/useReturnItemSlipAdjustmentSlips';
import { AdjustmentSlipsTable } from './components/AdjustmentSlips/AdjustmentSlipsTable';
import { CreateAdjustmentSlipModal } from './components/AdjustmentSlips/CreateAdjustmentSlipModal';
import { ViewAdjustmentSlipModal } from './components/AdjustmentSlips/ViewAdjustmentSlipModal';

const columns: ColumnsType = [
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Qty Returned', dataIndex: 'qtyReturned' },
	{ title: 'Qty Received', dataIndex: 'qtyReceived' },
	{ title: 'Status', dataIndex: 'status' },
];

interface Props {
	match: any;
}

export const ViewReturnItemSlip = ({ match }: Props) => {
	// VARIABLES
	const returnItemSlipId = match?.params?.id;

	// CUSTOM HOOKS

	const {
		data: returnItemSlip,
		isFetching: isFetchingReturnItemSlip,
		error: returnItemSlipErrors,
	} = useReturnItemSlipRetrieve({
		id: returnItemSlipId,
		options: { enabled: _.isNumber(returnItemSlipId) },
	});

	// METHODS
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

	return (
		<Content
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
			rightTitle={`#${returnItemSlipId}`}
			title="[VIEW] Return Item Slip"
		>
			<RequestErrors
				errors={convertIntoArray(returnItemSlipErrors)}
				withSpaceBottom
			/>

			<Spin spinning={isFetchingReturnItemSlip}>
				{returnItemSlip && <Details returnItemSlip={returnItemSlip} />}
			</Spin>

			<AdjustmentSlips
				returnItemSlip={returnItemSlip}
				returnItemSlipId={returnItemSlipId}
			/>
		</Content>
	);
};

interface DetailsProps {
	returnItemSlip: any;
}

const Details = ({ returnItemSlip }: DetailsProps) => {
	// STATES
	const [requestedProducts, setRequestedProducts] = useState([]);

	// METHODS
	useEffect(() => {
		const data = returnItemSlip.products.map((item) => ({
			key: item.id,
			name: item.product.name,
			qtyReturned: formatQuantity({
				unitOfMeasurement: item.product.unit_of_measurement,
				quantity: item.quantity_returned,
			}),
			qtyReceived: item?.quantity_received
				? formatQuantity({
						unitOfMeasurement: item.product.unit_of_measurement,
						quantity: item.quantity_received,
				  })
				: EMPTY_CELL,
			status: getReturnItemSlipStatus(item.status),
		}));

		setRequestedProducts(data);
	}, [returnItemSlip]);

	return (
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
	);
};

interface AdjustmentSlipsProps {
	returnItemSlipId: string;
	returnItemSlip?: any;
}
const AdjustmentSlips = ({
	returnItemSlipId,
	returnItemSlip,
}: AdjustmentSlipsProps) => {
	// STATE
	const [
		createAdjustmentSlipVisible,
		setCreateAdjustmentSlipVisible,
	] = useState(false);
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
						// retrieveReturnItemSlip(); // TODO: Add invalidate the useReturnItemSlipRetriev in here or in the use of adjustment
						listReturnItemSlipAdjustmentSlipsFn();
					}}
				/>
			)}
		</Box>
	);
};
