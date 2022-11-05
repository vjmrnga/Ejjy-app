/* eslint-disable no-underscore-dangle */
import { Col, Row, Select, Table } from 'antd';
import { Content, RequestErrors, TableHeader } from 'components';
import { Box, Label } from 'components/elements';
import {
	ALL_OPTION_KEY,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	requisitionSlipActionsOptionsWithAll,
	userTypes,
} from 'global';
import { useQueryParams, useRequisitionSlips } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import { upperFirst } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
	convertIntoArray,
	filterOption,
	formatDateTime,
	getRequestor,
	getRequisitionSlipStatus,
} from 'utils';

const columns = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Date Requested', dataIndex: 'datetimeCreated' },
	{ title: 'Requestor', dataIndex: 'requestor' },
	{ title: 'Request Type', dataIndex: 'type' },
	{ title: 'Actions', dataIndex: 'action' },
	{ title: 'Progress', dataIndex: 'progress' },
];

export const RequisitionSlips = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const history = useHistory();
	const { user } = useAuth();
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { requisitionSlips, total },
		isFetching: isFetchingRequisitionSlips,
		error: listError,
	} = useRequisitionSlips({
		params: {
			...params,
			// TODO: Temporarily remove branch id from the payload until we figure out to pass the online id
			// branchId: user?.branch?.id,
			status: params.status === ALL_OPTION_KEY ? null : params.status,
		},
	});
	// TODO: Temporarily remove pending count until we figure out to pass the online id of user
	// const {
	// 	data: pendingCount,
	// 	isFetching: isFetchingPendingCount,
	// 	error: retrieveError,
	// } = useRequisitionSlipsRetrievePendingCount({
	// 	params: { userId: user.id },
	// });

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
				key: id,
				id: <Link to={`/branch-manager/requisition-slips/${id}`}>{id}</Link>,
				datetimeCreated: dateTime,
				requestor: getRequestor(requisitionSlip),
				type: upperFirst(type),
				action: _action,
				progress: _progress,
			};
		});

		setDataSource(formattedProducts);
	}, [requisitionSlips]);

	return (
		<Content title="Requisition Slips">
			<Box>
				<TableHeader
					buttonName="Create Requisition Slip"
					onCreate={() => {
						history.push('/branch-manager/requisition-slips/create');
					}}
				/>

				<RequestErrors
					className="px-6"
					errors={[
						// ...convertIntoArray(retrieveError, 'Pending Count'),
						...convertIntoArray(listError),
					]}
					withSpaceBottom
				/>

				<Filter />
				<Table
					columns={columns}
					dataSource={dataSource}
					// loading={isFetchingPendingCount || isFetchingRequisitionSlips}
					loading={isFetchingRequisitionSlips}
					pagination={{
						current: Number(params.page) || DEFAULT_PAGE,
						total,
						pageSize: Number(params.pageSize) || DEFAULT_PAGE_SIZE,
						onChange: (page, newPageSize) => {
							setQueryParams({
								page,
								pageSize: newPageSize,
							});
						},
						disabled: !dataSource,
						position: ['bottomCenter'],
						pageSizeOptions: ['5', '10', '15'],
					}}
					scroll={{ x: 1000 }}
				/>
			</Box>
		</Content>
	);
};

const Filter = () => {
	const { params, setQueryParams } = useQueryParams();

	return (
		<Row className="mb-4 px-6" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Status" spacing />
				<Select
					className="w-100"
					defaultValue={params.status || ALL_OPTION_KEY}
					filterOption={filterOption}
					optionFilterProp="children"
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ status: value }, { shouldResetPage: true });
					}}
				>
					{requisitionSlipActionsOptionsWithAll.map(({ name, value }) => (
						<Select.Option key={value} value={value}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Col>
		</Row>
	);
};
