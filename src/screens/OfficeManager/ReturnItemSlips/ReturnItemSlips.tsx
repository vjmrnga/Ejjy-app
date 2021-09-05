import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { AddButtonIcon, Content } from '../../../components';
import { Box, ButtonLink } from '../../../components/elements';
import { ViewReturnItemSlipModal } from '../../../components/modals/ViewReturnItemSlipModal';
import { EMPTY_CELL } from '../../../global/constants';
import { pageSizeOptions } from '../../../global/options';
import { request } from '../../../global/types';
import { useReturnItemSlips } from '../../../hooks/useReturnItemSlips';
import {
	formatDateTime,
	getReturnItemSlipStatus,
} from '../../../utils/function';
import { AssignReturnItemSlipModal } from './components/AssignReturnItemSlipModal';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Returned', dataIndex: 'datetime_sent' },
	{ title: 'Date Received', dataIndex: 'datetime_received' },
	{ title: 'Returned By (Branch)', dataIndex: 'returned_by_branch' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Actions', dataIndex: 'actions' },
];

const modals = {
	VIEW: 0,
	ASSIGN: 1,
};

export const ReturnItemSlips = () => {
	// STATES
	const [data, setData] = useState([]);
	const [selectedReturnItemSlip, setSelectedReturnItemSlip] = useState(null);
	const [modalType, setModalType] = useState(null);

	// CUSTOM HOOKS
	const {
		returnItemSlips,
		pageCount,
		currentPage,
		pageSize,
		getReturnItemSlips,
		status: returnItemSlipsStatus,
	} = useReturnItemSlips();

	// METHODS
	useEffect(() => {
		getReturnItemSlips({ page: 1 });
	}, []);

	useEffect(() => {
		setData(
			returnItemSlips.map((returnItemSlip) => ({
				key: returnItemSlip.id,
				id: (
					<ButtonLink
						text={returnItemSlip.id}
						onClick={() => onOpenModal(returnItemSlip, modals.VIEW)}
					/>
				),
				datetime_sent: returnItemSlip.datetime_sent
					? formatDateTime(returnItemSlip.datetime_sent)
					: EMPTY_CELL,
				datetime_received: returnItemSlip.datetime_received
					? formatDateTime(returnItemSlip.datetime_received)
					: EMPTY_CELL,
				returned_by_branch: returnItemSlip.sender.branch.name,
				status: getReturnItemSlipStatus(returnItemSlip.status),
				actions: !returnItemSlip.receiver ? (
					<AddButtonIcon
						onClick={() => onOpenModal(returnItemSlip, modals.ASSIGN)}
						tooltip="Assign"
					/>
				) : (
					EMPTY_CELL
				),
			})),
		);
	}, [returnItemSlips]);

	const onOpenModal = (returnItemSlip, type) => {
		setModalType(type);
		setSelectedReturnItemSlip(returnItemSlip);
	};

	const onPageChange = (page, newPageSize) => {
		getReturnItemSlips(
			{
				page,
				pageSize: newPageSize,
			},
			newPageSize !== pageSize,
		);
	};

	return (
		<Content title="Return Item Slips">
			<Box>
				<Table
					columns={columns}
					dataSource={data}
					scroll={{ x: 800 }}
					pagination={{
						current: currentPage,
						total: pageCount,
						pageSize,
						onChange: onPageChange,
						disabled: !data,
						position: ['bottomCenter'],
						pageSizeOptions,
					}}
					loading={returnItemSlipsStatus === request.REQUESTING}
				/>
			</Box>
			{modalType === modals.VIEW && selectedReturnItemSlip && (
				<ViewReturnItemSlipModal
					returnItemSlip={selectedReturnItemSlip}
					onClose={() => onOpenModal(null, null)}
				/>
			)}

			{modalType === modals.ASSIGN && selectedReturnItemSlip && (
				<AssignReturnItemSlipModal
					returnItemSlip={selectedReturnItemSlip}
					onSuccess={() => getReturnItemSlips({ page: 1 }, true)}
					onClose={() => onOpenModal(null, null)}
				/>
			)}
		</Content>
	);
};
