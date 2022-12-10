import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDateTime, getReturnItemSlipStatus } from 'utils';
import { AddButtonIcon, Content } from '../../../components';
import { Box } from '../../../components/elements';
import { EMPTY_CELL } from '../../../global/constants';
import { pageSizeOptions } from '../../../global/options';
import { request } from '../../../global/types';
import { useReturnItemSlips } from '../../../hooks/useReturnItemSlips';
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
						tooltip="Assign"
						onClick={() => setSelectedReturnItemSlip(returnItemSlip)}
					/>
				) : (
					EMPTY_CELL
				),
			})),
		);
	}, [returnItemSlips]);

	const handlePageChange = (page, newPageSize) => {
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
					loading={returnItemSlipsStatus === request.REQUESTING}
					pagination={{
						current: currentPage,
						total: pageCount,
						pageSize,
						onChange: handlePageChange,
						disabled: !data,
						position: ['bottomCenter'],
						pageSizeOptions,
					}}
					scroll={{ x: 800 }}
				/>
			</Box>

			{selectedReturnItemSlip && (
				<AssignReturnItemSlipModal
					returnItemSlip={selectedReturnItemSlip}
					onClose={() => setSelectedReturnItemSlip(null)}
					onSuccess={() => getReturnItemSlips({ page: 1 }, true)}
				/>
			)}
		</Content>
	);
};
