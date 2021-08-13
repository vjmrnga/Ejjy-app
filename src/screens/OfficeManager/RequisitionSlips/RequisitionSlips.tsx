import { Table } from 'antd';
import { upperFirst } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Content, TableHeaderRequisitionSlip } from '../../../components';
import { Box } from '../../../components/elements';
import { EMPTY_CELL } from '../../../global/constants';
import { requisitionSlipActionsOptionsWithAll } from '../../../global/options';
import { request, userTypes } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { useBranches } from '../../../hooks/useBranches';
import { useRequisitionSlips } from '../../../hooks/useRequisitionSlips';
import {
	formatDateTime,
	getRequisitionSlipStatus,
} from '../../../utils/function';
import './style.scss';

const columns = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Requested', dataIndex: 'datetime_created' },
	{ title: 'Requestor', dataIndex: 'requestor' },
	{ title: 'Request Type', dataIndex: 'type' },
	{ title: 'Actions', dataIndex: 'action' },
	{ title: 'Progress', dataIndex: 'progress' },
];

export const RequisitionSlips = () => {
	// STATES
	const [data, setData] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState('all');
	const [selectedBranch, setSelectedBranch] = useState('all');
	const [pendingCount, setPendingCount] = useState(0);

	// CUSTOM HOOKS
	const { branches } = useBranches();
	const { user } = useAuth();
	const {
		requisitionSlips,
		pageCount,
		currentPage,
		pageSize,
		getRequisitionSlipsExtended,
		status: requisitionSlipsStatus,
	} = useRequisitionSlips();
	const { getPendingCount } = useRequisitionSlips();

	// METHODS
	useEffect(() => {
		const formattedProducts = requisitionSlips.map((requisitionSlip) => {
			const {
				id,
				type,
				requesting_user,
				progress,
				action: prAction,
			} = requisitionSlip;
			const { datetime_created, action } = prAction;
			const dateTime = formatDateTime(datetime_created);

			return {
				id: <Link to={`/office-manager/requisition-slips/${id}`}>{id}</Link>,
				datetime_created: dateTime,
				requestor: requesting_user?.branch?.name,
				type: upperFirst(type),
				action: getRequisitionSlipStatus(action, userTypes.OFFICE_MANAGER),
				progress: progress
					? `${progress.current} / ${progress.total}`
					: EMPTY_CELL,
			};
		});

		setData(formattedProducts);
	}, [requisitionSlips]);

	// Filter by status and branch
	useEffect(() => {
		onFetchRequisitionSlips(1, pageSize, true);
		getPendingCount({ userId: user.id }, ({ status, data: count }) => {
			if (status === request.SUCCESS) {
				setPendingCount(count);
			}
		});
	}, [selectedStatus, selectedBranch]);

	const getBranchOptions = useCallback(
		() => [
			{
				value: 'all',
				name: 'All',
			},
			...branches.map(({ id, name }) => ({ value: id, name })),
		],
		[branches],
	);

	const onFetchRequisitionSlips = (page, newPageSize, shouldReset) => {
		getRequisitionSlipsExtended(
			{
				branchId: selectedBranch === 'all' ? null : selectedBranch,
				status: selectedStatus === 'all' ? null : selectedStatus,
				page,
				pageSize: newPageSize,
			},
			shouldReset,
		);
	};

	const onPageChange = (page, newPageSize) => {
		onFetchRequisitionSlips(page, newPageSize, newPageSize !== pageSize);
	};

	return (
		<Content
			className="RequisitionSlips"
			title="F-RS1"
			description="Requests from branches"
		>
			<Box>
				<TableHeaderRequisitionSlip
					statuses={requisitionSlipActionsOptionsWithAll}
					onStatusSelect={(status) => setSelectedStatus(status)}
					branches={getBranchOptions()}
					onBranchSelect={(branch) => setSelectedBranch(branch)}
					pending={pendingCount}
				/>

				<Table
					columns={columns}
					dataSource={data}
					pagination={{
						current: currentPage,
						total: pageCount,
						pageSize,
						onChange: onPageChange,
						disabled: !data,
						position: ['bottomCenter'],
						pageSizeOptions: ['5', '10', '15'],
					}}
					loading={requisitionSlipsStatus === request.REQUESTING}
				/>
			</Box>
		</Content>
	);
};
