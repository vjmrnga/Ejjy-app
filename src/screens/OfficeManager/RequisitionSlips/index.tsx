import { Col, Row, Select, Table } from 'antd';
import { Content, RequestErrors, TableHeaderRequisitionSlip } from 'components';
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
import { upperFirst } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	convertIntoArray,
	filterOption,
	formatDateTime,
	getRequestor,
	getRequisitionSlipStatus,
} from 'utils';
import './style.scss';

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
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { requisitionSlips, total },
		isFetching: isFetchingRequisitionSlips,
		error: listError,
	} = useRequisitionSlips({
		params: {
			...params,
			// TODO: Temporarily remove branch id from the payload until we figure out to pass the online id
			// branchId: params.branchId === ALL_OPTION_KEY ? null : params.branchId,
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
			const { id, type, progress, action: prAction } = requisitionSlip;
			const { datetime_created, action } = prAction;
			const dateTime = formatDateTime(datetime_created);

			return {
				key: id,
				id: <Link to={`/office-manager/requisition-slips/${id}`}>{id}</Link>,
				datetimeCreated: dateTime,
				requestor: getRequestor(requisitionSlip),
				type: upperFirst(type),
				action: getRequisitionSlipStatus(action, userTypes.OFFICE_MANAGER),
				progress: progress
					? `${progress.current} / ${progress.total}`
					: EMPTY_CELL,
			};
		});

		setDataSource(formattedProducts);
	}, [requisitionSlips]);

	return (
		<Content
			className="RequisitionSlips"
			description="Requests from branches"
			title="F-RS1"
		>
			<Box>
				<TableHeaderRequisitionSlip />

				<Filter />

				<RequestErrors
					className="px-6"
					errors={[
						// ...convertIntoArray(retrieveError, 'Pending Count'),
						...convertIntoArray(listError),
					]}
					withSpaceBottom
				/>

				<Table
					columns={columns}
					dataSource={dataSource}
					loading={isFetchingRequisitionSlips}
					// loading={isFetchingPendingCount || isFetchingRequisitionSlips}
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
				/>
			</Box>
		</Content>
	);
};

const Filter = () => {
	const { params, setQueryParams } = useQueryParams();
	// TODO: Temporarily remove branch id from the payload until we figure out to pass the online id
	// const {
	// 	data: { branches },
	// } = useBranches();

	return (
		<Row className="px-6 mb-4" gutter={[16, 16]}>
			{/* <Col lg={12} span={24}>
				<Label label="Branch" spacing />
				<Select
					className="w-100"
					defaultValue={
						params.branchId ? Number(params.branchId) : ALL_OPTION_KEY
					}
					// NOTE: Need to convert to Number so default value will work
					filterOption={filterOption}
					optionFilterProp="children"
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ branchId: value }, { shouldResetPage: true });
					}}
				>
					<Select.Option value="all">All</Select.Option>
					{branches.map(({ id, name }) => (
						<Select.Option key={id} value={id}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Col> */}
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
