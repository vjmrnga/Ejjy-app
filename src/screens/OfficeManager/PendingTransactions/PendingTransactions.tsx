import { Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import React, { useEffect, useState } from 'react';
import {
	CancelButtonIcon,
	CheckButtonIcon,
	Content,
	TableHeader,
} from '../../../components';
import { Box, ButtonLink } from '../../../components/elements';
import { pageSizeOptions } from '../../../global/options';
import { request } from '../../../global/types';
import { usePreparationSlips } from '../../../hooks/usePreparationSlips';
import {
	formatDateTime,
	getPreparationSlipStatus,
} from '../../../utils/function';
import { ViewPreparationSlipModal } from './components/ViewPreparationSlipModal';

const columns: ColumnsType = [
	{
		title: 'ID',
		dataIndex: 'id',
		width: 100,
		fixed: 'left',
	},
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
	{ title: 'Status', dataIndex: 'status', align: 'center' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const PendingTransactions = () => {
	// STATES
	const [data, setData] = useState([]);
	const [selectedPreparationSlip, setSelectedPreparationSlip] = useState(null);

	// CUSTOM HOOKS
	const {
		preparationSlips,
		pageCount,
		pageSize,
		currentPage,
		removeItemInPagination,

		getPreparationSlips,
		approveOrDisapprovePreparationSlip,
		status: preparationSlipsStatus,
	} = usePreparationSlips();

	// METHODS
	useEffect(() => {
		getPreparationSlips({
			isPsForApproval: true,
			page: 1,
		});
	}, []);

	useEffect(() => {
		setData(
			preparationSlips.map((preparationSlip) => ({
				key: preparationSlip.id,
				id: (
					<ButtonLink
						text={preparationSlip.id}
						onClick={() => setSelectedPreparationSlip(preparationSlip)}
					/>
				),
				datetime_created: formatDateTime(preparationSlip.datetime_created),
				status: getPreparationSlipStatus(preparationSlip.status),
				actions: (
					<Space size={10}>
						<CheckButtonIcon
							tooltip="Approve"
							onClick={() => {
								onApproveOrDisapprovePreparationSlip(preparationSlip, true);
							}}
						/>

						<CancelButtonIcon
							tooltip="Disapprove"
							onClick={() => {
								onApproveOrDisapprovePreparationSlip(preparationSlip, false);
							}}
						/>
					</Space>
				),
			})),
		);
	}, [preparationSlips]);

	const onApproveOrDisapprovePreparationSlip = (
		preparationSlip,
		isApproved,
	) => {
		approveOrDisapprovePreparationSlip(
			{ id: preparationSlip.id, isApproved },
			({ status }) => {
				if (status === request.SUCCESS) {
					removeItemInPagination(preparationSlip);
				}
			},
		);
	};

	const onPageChange = (page, newPageSize) => {
		getPreparationSlips(
			{ isPsForApproval: true, page, pageSize: newPageSize },
			newPageSize !== pageSize,
		);
	};

	return (
		<Content className="PendingTransactions" title="Pending Transactions">
			<Box>
				<TableHeader />

				<Table
					columns={columns}
					dataSource={data}
					scroll={{ x: 650 }}
					rowKey="key"
					pagination={{
						current: currentPage,
						total: pageCount,
						pageSize,
						onChange: onPageChange,
						disabled: !data,
						position: ['bottomCenter'],
						pageSizeOptions,
					}}
					loading={preparationSlipsStatus === request.REQUESTING}
				/>

				{selectedPreparationSlip && (
					<ViewPreparationSlipModal
						preparationSlip={selectedPreparationSlip}
						onClose={() => setSelectedPreparationSlip(null)}
					/>
				)}
			</Box>
		</Content>
	);
};
