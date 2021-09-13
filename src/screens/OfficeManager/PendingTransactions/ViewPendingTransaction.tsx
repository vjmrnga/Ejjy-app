import { Divider, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
	Breadcrumb,
	ColoredText,
	Content,
	DetailsHalf,
	DetailsRow,
	TableHeader,
} from '../../../components';
import { Box } from '../../../components/elements';
import Label from '../../../components/elements/Label/Label';
import { EMPTY_CELL, MAX_PAGE_SIZE } from '../../../global/constants';
import { request, preparationSlipStatus } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import {
	formatDateTime,
	getPreparationSlipStatus,
} from '../../../utils/function';
import { usePreparationSlips } from '../hooks/usePreparationSlips';
import { AdjustmentSlipsTable } from './components/AdjustmentSlips/AdjustmentSlipsTable';
import './style.scss';
import { useOrderSlipAdjustmentSlips } from '../hooks/useOrderSlipAdjustmentSlips';
import { CreateAdjustmentSlipModal } from './components/AdjustmentSlips/CreateAdjustmentSlipModal';
import { ViewAdjustmentSlipModal } from './components/AdjustmentSlips/ViewAdjustmentSlipModal';

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

	// METHODS
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

	return (
		<Content
			title="[VIEW] F-PS1"
			rightTitle={`#${pendingTransactionId}`}
			breadcrumb={<Breadcrumb items={getBreadcrumbItems()} />}
		>
			<Details
				pendingTransactionId={pendingTransactionId}
				pendingTransaction={pendingTransaction}
				setPendingTransaction={setPendingTransaction}
			/>
			<AdjustmentSlips pendingTransaction={pendingTransaction} />
		</Content>
	);
};

interface DetailsProps {
	pendingTransactionId: string;
	pendingTransaction?: any;
	setPendingTransaction: any;
}

const Details = ({
	pendingTransactionId,
	pendingTransaction,
	setPendingTransaction,
}: DetailsProps) => {
	const history = useHistory();

	// STATES
	const [requestedProducts, setRequestedProducts] = useState([]);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const { retrieve, status: preparationSlipsStatus } = usePreparationSlips();

	// Effect: Fetch delivery receipt of order slip
	useEffect(() => {
		if (pendingTransactionId) {
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
		}
	}, [pendingTransactionId]);

	useEffect(() => {
		if (pendingTransaction) {
			setRequestedProducts(
				pendingTransaction.products.map((item) => ({
					code: item.product.barcode || item.product.textcode,
					name: item.product.name,
					qty_fulfilled: item.fulfilled_quantity_piece || EMPTY_CELL,
					qty_requested: item.quantity_piece,
					current_balance: item.current_balance,
					personnel: `${item.assigned_person.first_name} ${item.assigned_person.last_name}`,
					has_qty_allowance: item.product.has_quantity_allowance ? (
						<ColoredText variant="primary" text="Yes" />
					) : (
						<ColoredText variant="error" text="No" />
					),
				})),
			);
		}
	}, [pendingTransaction]);

	return (
		<Spin size="large" spinning={preparationSlipsStatus === request.REQUESTING}>
			<Box className="PaddingHorizontal PaddingVertical">
				<DetailsRow>
					<DetailsHalf label="ID" value={pendingTransaction?.id} />
					<DetailsHalf
						label="Date & Time Created"
						value={formatDateTime(pendingTransaction?.datetime_created)}
					/>
					<DetailsHalf
						label="Status"
						value={getPreparationSlipStatus(pendingTransaction?.status)}
					/>
				</DetailsRow>

				<Divider dashed />

				<Label label="Requested Products" spacing />
				<Table
					columns={columns}
					dataSource={requestedProducts}
					scroll={{ x: 1200 }}
					pagination={false}
				/>
			</Box>
		</Spin>
	);
};

interface AdjustmentSlipsProps {
	pendingTransaction?: any;
}
const AdjustmentSlips = ({ pendingTransaction }: AdjustmentSlipsProps) => {
	// STATE
	const [createAdjustmentSlipVisible, setCreateAdjustmentSlipVisible] =
		useState(false);
	const [selectedAdjustmentSlip, setSelectedAdjustmentSlip] = useState(null);

	// CUSTOM HOOKS
	const {
		adjustmentSlips,
		list,
		status: orderSlipAdjustmentSlipsStatus,
	} = useOrderSlipAdjustmentSlips();

	useEffect(() => {
		if (pendingTransaction) {
			fetchAdjustmentSlips();
		}
	}, [pendingTransaction]);

	const fetchAdjustmentSlips = () => {
		list(
			{
				page: 1,
				pageSize: MAX_PAGE_SIZE,
				orderSlipId: pendingTransaction.id,
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
					pendingTransaction?.status !== preparationSlipStatus.ERROR
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
					preparationSlip={pendingTransaction}
					onSuccess={fetchAdjustmentSlips}
					onClose={() => setCreateAdjustmentSlipVisible(false)}
				/>
			)}
		</Box>
	);
};
