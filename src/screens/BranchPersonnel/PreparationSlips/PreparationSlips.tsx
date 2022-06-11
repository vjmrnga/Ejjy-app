/* eslint-disable no-mixed-spaces-and-tabs */
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AddButtonIcon, Content, TableHeader } from '../../../components';
import { Box, ButtonLink } from '../../../components/elements';
import { pageSizeOptions } from '../../../global/options';
import { preparationSlipStatus, request } from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
import { usePreparationSlips } from '../../../hooks/usePreparationSlips';
import { formatDateTime, getPreparationSlipStatus } from 'utils';
import { useOrderSlips } from '../../BranchManager/hooks/useOrderSlips';
import { ViewPreparationSlipModal } from './components/ViewPreparationSlipModal';
import './style.scss';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const PreparationSlips = () => {
	// STATES
	const [data, setData] = useState([]);
	const [selectedPreparationSlip, setSelectedPreparationSlip] = useState(null);
	const [pendingCount, setPendingCount] = useState(0);

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const {
		preparationSlips,
		pageCount,
		pageSize,
		currentPage,

		getPreparationSlips,
		status: preparationSlipsStatus,
	} = usePreparationSlips();

	const { getPendingCount } = useOrderSlips();

	// METHODS
	useEffect(() => {
		getPreparationSlips({
			assignedPersonnelId: user.id,
			requestingUserId: user.id,
			page: 1,
		});
		getPendingCount({ userId: user.id }, ({ status, data: count }) => {
			if (status === request.SUCCESS) {
				setPendingCount(count);
			}
		});
	}, []);

	useEffect(() => {
		const formattedPreparationSlips = preparationSlips.map(
			(preparationSlip) => ({
				key: preparationSlip.id,
				id: (
					<ButtonLink
						text={preparationSlip.id}
						onClick={() => setSelectedPreparationSlip(preparationSlip)}
					/>
				),
				datetime_created: formatDateTime(preparationSlip.datetime_created),
				status: getPreparationSlipStatus(preparationSlip.status),
				actions:
					preparationSlip.status === preparationSlipStatus.NEW ? (
						<AddButtonIcon
							onClick={() => {
								history.push(
									`/branch-personnel/preparation-slips/${preparationSlip.id}`,
								);
							}}
							tooltip="Fulfill"
						/>
					) : null,
			}),
		);

		setData(formattedPreparationSlips);
	}, [preparationSlips]);

	const onPageChange = (page, newPageSize) => {
		getPreparationSlips(
			{
				assignedPersonnelId: user.id,
				requestingUserId: user.id,
				page,
				pageSize: newPageSize,
			},
			newPageSize !== pageSize,
		);
	};

	return (
		<Content title="Preparation Slips">
			<Box>
				<TableHeader pending={pendingCount} />

				<Table
					columns={columns}
					dataSource={data}
					scroll={{ x: 650 }}
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
