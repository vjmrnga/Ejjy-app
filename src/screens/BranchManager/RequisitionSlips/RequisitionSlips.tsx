/* eslint-disable no-underscore-dangle */
import { Table } from 'antd';
import { upperFirst } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Content, TableHeader } from '../../../components';
import { Box } from '../../../components/elements';
import { EMPTY_CELL } from '../../../global/constants';
import { requisitionSlipActionsOptionsWithAll } from '../../../global/options';
import {
	request,
	requisitionSlipActions,
	userTypes,
} from '../../../global/types';
import { useAuth } from '../../../hooks/useAuth';
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

const pendingRequisitionSlipActions = [
	requisitionSlipActions.F_DS1_CREATING,
	requisitionSlipActions.F_DS1_CREATED,
	requisitionSlipActions.F_DS1_DELIVERING,
];

export const RequisitionSlips = () => {
	// STATES
	const [data, setData] = useState([]);
	const [selectedStatus, setSelectedStatus] = useState('all');

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const {
		requisitionSlips,
		pageCount,
		currentPage,
		pageSize,
		getRequisitionSlipsExtended,
		status: requisitionSlipsStatus,
	} = useRequisitionSlips();

	// METHODS
	useEffect(() => {
		onFetchRequisitionSlips(1, pageSize, true);
	}, []);

	useEffect(() => {
		onFetchRequisitionSlips(1, pageSize, true);
	}, [selectedStatus]);

	// Effect: Format requisitionSlips to be rendered in Table
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

			const isOwnRequisitionSlip =
				user?.branch?.id === requesting_user?.branch?.id;
			const _action = isOwnRequisitionSlip
				? getRequisitionSlipStatus(action, userTypes.BRANCH_MANAGER)
				: EMPTY_CELL;
			let _progress = progress
				? `${progress.current} / ${progress.total}`
				: EMPTY_CELL;
			_progress = isOwnRequisitionSlip ? _progress : EMPTY_CELL;

			return {
				id: <Link to={`/branch-manager/requisition-slips/${id}`}>{id}</Link>,
				datetime_created: dateTime,
				requestor: requesting_user?.branch?.name,
				type: upperFirst(type),
				action: _action,
				progress: _progress,
			};
		});

		setData(formattedProducts);
	}, [requisitionSlips]);

	const getPendingCount = useCallback(
		() =>
			requisitionSlips.filter(
				({ action, requesting_user }) =>
					pendingRequisitionSlipActions.includes(action?.action) &&
					user?.branch?.id === requesting_user?.branch?.id,
			).length,
		[requisitionSlips],
	);

	const onFetchRequisitionSlips = (page, newPageSize, shouldReset) => {
		getRequisitionSlipsExtended(
			{
				branchId: user?.branch?.id,
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
		<Content className="RequisitionSlips" title="Requisition Slips">
			<Box>
				<TableHeader
					buttonName="Create Requisition Slip"
					statuses={requisitionSlipActionsOptionsWithAll}
					onStatusSelect={(status) => setSelectedStatus(status)}
					onCreate={() => {
						history.push('/branch-manager/requisition-slips/create');
					}}
					pending={getPendingCount()}
				/>

				<Table
					columns={columns}
					dataSource={data}
					scroll={{ x: 1000 }}
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
