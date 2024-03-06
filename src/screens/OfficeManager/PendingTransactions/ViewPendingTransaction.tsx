/* eslint-disable no-mixed-spaces-and-tabs */
import { Descriptions, Divider, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Breadcrumb, ColoredText, Content, TableHeader } from 'components';
import { Box, Label } from 'components/elements';
import {
	EMPTY_CELL,
	MAX_PAGE_SIZE,
	preparationSlipStatus,
	request,
} from 'global';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserStore } from 'stores';
import {
	formatDateTime,
	formatQuantity,
	getPreparationSlipStatus,
} from 'utils';
import { useOrderSlipAdjustmentSlips } from '../hooks/useOrderSlipAdjustmentSlips';
import { usePreparationSlips } from '../hooks/usePreparationSlips';
import { AdjustmentSlipsTable } from './components/AdjustmentSlips/AdjustmentSlipsTable';
import { CreateAdjustmentSlipModal } from './components/AdjustmentSlips/CreateAdjustmentSlipModal';
import { ViewAdjustmentSlipModal } from './components/AdjustmentSlips/ViewAdjustmentSlipModal';
import './style.scss';

const columns: ColumnsType = [
	{ title: 'Code', dataIndex: 'code' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Qty Fulfilled', dataIndex: 'qty_fulfilled' },
	{ title: 'Qty Requested', dataIndex: 'qty_requested' },
	{ title: 'Current Balance', dataIndex: 'current_balance' },
	{ title: 'Personnel', dataIndex: 'personnel' },
	{ title: 'Has Quantity Allowance', dataIndex: 'has_qty_allowance' },
];

interface Props {
	match: any;
}

export const ViewPendingTransaction = ({ match }: Props) => {
	// ROUTING
	const pendingTransactionId = match?.params?.id;

	// STATES
	const [pendingTransaction, setPendingTransaction] = useState(null);

	// CUSTOM HOOKS
	const history = useHistory();
	const user = useUserStore((state) => state.user);
	const { retrieve, status: preparationSlipsStatus } = usePreparationSlips();

	// METHODS
	useEffect(() => {
		if (pendingTransactionId) {
			retrievePreparationSlip();
		}
	}, [pendingTransactionId]);

	const getBreadcrumbItems = useCallback(
		() => [
			{
				name: 'Pending Transactions',
				link: '/office-manager/pending-transactions',
			},
			{ name: `#${pendingTransactionId}` },
		],
		[pendingTransactionId],
	);

	const retrievePreparationSlip = () => {
		retrieve(
			{ id: pendingTransactionId, requestingUserId: user.id },
			({ status, data }) => {
				if (status === request.SUCCESS) {
					setPendingTransaction(data);
				} else if (status === request.ERROR) {
					history.replace('/404');
				}
			},
		);
	};

	return (
		<Content
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
			rightTitle={`#${pendingTransactionId}`}
			title="[VIEW] F-PS1"
		>
			<Details
				pendingTransaction={pendingTransaction}
				preparationSlipsStatus={preparationSlipsStatus}
			/>
			<AdjustmentSlips
				pendingTransaction={pendingTransaction}
				pendingTransactionId={pendingTransactionId}
				retrievePreparationSlip={retrievePreparationSlip}
			/>
		</Content>
	);
};

interface DetailsProps {
	pendingTransaction?: any;
	preparationSlipsStatus: number;
}

const Details = ({
	pendingTransaction,
	preparationSlipsStatus,
}: DetailsProps) => {
	// STATES
	const [requestedProducts, setRequestedProducts] = useState([]);

	// CUSTOM HOOKS

	// Effect: Fetch delivery receipt of order slip
	useEffect(() => {
		if (pendingTransaction) {
			setRequestedProducts(
				pendingTransaction.products.map((item) => ({
					code: item.product.barcode || item.product.textcode,
					name: item.product.name,
					qty_fulfilled: item?.fulfilled_quantity_piece
						? formatQuantity({
								unitOfMeasurement: item.product.unit_of_measurement,
								quantity: item.fulfilled_quantity_piece,
						  })
						: EMPTY_CELL,
					qty_requested: formatQuantity({
						unitOfMeasurement: item.product.unit_of_measurement,
						quantity: item.quantity_piece,
					}),
					current_balance: formatQuantity({
						unitOfMeasurement: item.product.unit_of_measurement,
						quantity: item.current_balance,
					}),
					personnel: `${item.assigned_person.first_name} ${item.assigned_person.last_name}`,
					has_qty_allowance: item.product.has_quantity_allowance ? (
						<ColoredText text="Yes" variant="primary" />
					) : (
						<ColoredText text="No" variant="error" />
					),
				})),
			);
		}
	}, [pendingTransaction]);

	return (
		<Spin spinning={preparationSlipsStatus === request.REQUESTING}>
			<Box className="pa-6">
				<Descriptions column={2} bordered>
					<Descriptions.Item label="ID">
						{pendingTransaction?.id}
					</Descriptions.Item>
					<Descriptions.Item label="Date & Time Created">
						{formatDateTime(pendingTransaction?.datetime_created)}
					</Descriptions.Item>
					<Descriptions.Item label="Status">
						{getPreparationSlipStatus(pendingTransaction?.status)}
					</Descriptions.Item>
				</Descriptions>

				<Divider dashed />

				<Label label="Requested Products" spacing />
				<Table
					columns={columns}
					dataSource={requestedProducts}
					pagination={false}
					scroll={{ x: 1200 }}
					bordered
				/>
			</Box>
		</Spin>
	);
};

interface AdjustmentSlipsProps {
	pendingTransactionId: string;
	pendingTransaction?: any;
	retrievePreparationSlip?: any;
}
const AdjustmentSlips = ({
	pendingTransactionId,
	pendingTransaction,
	retrievePreparationSlip,
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
		list,
		status: orderSlipAdjustmentSlipsStatus,
	} = useOrderSlipAdjustmentSlips();

	useEffect(() => {
		if (pendingTransactionId) {
			listAdjustmentSlips();
		}
	}, [pendingTransactionId]);

	const listAdjustmentSlips = () => {
		list(
			{
				page: 1,
				pageSize: MAX_PAGE_SIZE,
				orderSlipId: pendingTransactionId,
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
					pendingTransaction?.status !== preparationSlipStatus.ERROR
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
					preparationSlip={pendingTransaction}
					onClose={() => setCreateAdjustmentSlipVisible(false)}
					onSuccess={() => {
						retrievePreparationSlip();
						listAdjustmentSlips();
					}}
				/>
			)}
		</Box>
	);
};
