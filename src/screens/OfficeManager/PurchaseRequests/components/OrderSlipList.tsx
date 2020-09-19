import React, { useCallback } from 'react';
import { Table, TableHeader } from '../../../../components';
import { Box } from '../../../../components/elements';
import { request } from '../../../../global/types';
import { calculateTableHeight } from '../../../../utils/function';
import '../style.scss';
import { CreateEditOrderSlipModal } from './CreateEditOrderSlipModal';
import { ViewOrderSlipModal } from './ViewOrderSlipModal';

const orderSlipsColumns = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'DR Status', dataIndex: 'dr_status' },
	{ title: 'Actions', dataIndex: 'actions' },
];

interface Props {
	// Table Header
	onCreateOrderSlip: any;

	// Table
	orderSlips: any;
	purchaseRequestStatus: number;

	// View Order Slip Modal
	viewOrderSlipVisible: boolean;
	onCloseViewOrderSlip: any;
	orderSlip: any;

	// Creat Edit Order Slip Modal
	branches: any;
	purchaseRequest: any;
	purchaseRequestProducts: any;
	selectedBranchId: number;
	onChangePreparingBranch: any;
	assignedPersonnelOptions: any;
	createEditOrderSlipVisible: boolean;
	onCreateEditOrderSlip: any;
	onCloseCreateEditOrderSlip: any;
}

export const OrderSlipList = ({
	// Table Header
	onCreateOrderSlip,

	// Table
	orderSlips,
	purchaseRequestStatus,

	// View Order Slip Modal
	viewOrderSlipVisible,
	onCloseViewOrderSlip,
	orderSlip,

	// Creat Edit Order Slip Modal
	branches,
	purchaseRequest,
	purchaseRequestProducts,
	selectedBranchId,
	onChangePreparingBranch,
	assignedPersonnelOptions,
	createEditOrderSlipVisible,
	onCreateEditOrderSlip,
	onCloseCreateEditOrderSlip,
}: Props) => {
	const getBranchOptions = useCallback(
		() =>
			branches.map((branch) => ({
				value: branch?.id,
				name: branch?.name,
			})),
		[branches],
	);

	return (
		<Box>
			<TableHeader title="F-OS1" buttonName="Create Order Slip" onCreate={onCreateOrderSlip} />

			<Table
				columns={orderSlipsColumns}
				dataSource={orderSlips}
				scroll={{ y: calculateTableHeight(orderSlips.length), x: '100%' }}
				loading={purchaseRequestStatus === request.REQUESTING}
			/>

			<ViewOrderSlipModal
				visible={viewOrderSlipVisible}
				orderSlip={orderSlip}
				onClose={onCloseViewOrderSlip}
			/>

			<CreateEditOrderSlipModal
				selectedBranchId={selectedBranchId}
				orderSlip={orderSlip}
				requestedProducts={purchaseRequestProducts}
				branchOptions={getBranchOptions()}
				onChangePreparingBranch={onChangePreparingBranch}
				assignedPersonnelOptions={assignedPersonnelOptions}
				purchaseRequest={purchaseRequest}
				visible={createEditOrderSlipVisible}
				onSubmit={onCreateEditOrderSlip}
				onClose={onCloseCreateEditOrderSlip}
				errors={[]}
				loading={purchaseRequestStatus === request.REQUESTING}
			/>
		</Box>
	);
};
