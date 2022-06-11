import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddButtonIcon, Content } from '../../../components';
import { Box } from '../../../components/elements';
import { EMPTY_CELL } from '../../../global/constants';
import { pageSizeOptions } from '../../../global/options';
import { request } from '../../../global/types';
import { useReturnItemSlips } from '../../../hooks/useReturnItemSlips';
import { formatDateTime, getReturnItemSlipStatus } from 'utils';
import { AssignReturnItemSlipModal } from './components/AssignReturnItemSlipModal';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Returned', dataIndex: 'datetime_sent' },
	{ title: 'Date Received', dataIndex: 'datetime_received' },
	{ title: 'Returned By (Branch)', dataIndex: 'returned_by_branch' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const ReturnItemSlips = () => {
	// STATES
	const [data, setData] = useState([]);
	const [selectedReturnItemSlip, setSelectedReturnItemSlip] = useState(null);

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
					<Link to={`/office-manager/return-item-slips/${returnItemSlip.id}`}>
						{returnItemSlip.id}
					</Link>
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
						onClick={() => setSelectedReturnItemSlip(returnItemSlip)}
						tooltip="Assign"
					/>
				) : (
					EMPTY_CELL
				),
			})),
		);
	}, [returnItemSlips]);

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

			{selectedReturnItemSlip && (
				<AssignReturnItemSlipModal
					returnItemSlip={selectedReturnItemSlip}
					onSuccess={() => getReturnItemSlips({ page: 1 }, true)}
					onClose={() => setSelectedReturnItemSlip(null)}
				/>
			)}
		</Content>
	);
};
