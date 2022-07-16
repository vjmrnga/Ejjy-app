import { Col, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader, TimeRangeFilter } from 'components';
import { Label } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	pageSizeOptions,
	timeRangeTypes,
} from 'global';
import {
	useBranchAssignments,
	useBranches,
	useQueryParams,
	useUsers,
} from 'hooks';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	filterOption,
	formatDateTime,
	getFullName,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'Branch', dataIndex: 'branch' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Date & Time', dataIndex: 'datetime' },
];

export const TabBranchAssignments = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branchAssignments, total },
		isFetching: isBranchAssignmentsFetching,
		error: branchAssignmentsError,
	} = useBranchAssignments({
		params: {
			...params,
			timeRange: params?.timeRange || timeRangeTypes.DAILY,
		},
	});

	// METHODS
	useEffect(() => {
		const data = branchAssignments.map((branchAssignment) => ({
			key: branchAssignment.id,
			branch: branchAssignment.branch.name,
			name: getFullName(branchAssignment.user),
			datetime: formatDateTime(branchAssignment.datetime_created),
		}));

		setDataSource(data);
	}, [branchAssignments]);

	return (
		<div>
			<TableHeader wrapperClassName="pt-2 px-0" title="Branch Assignments" />

			<Filter />

			<RequestErrors
				errors={convertIntoArray(branchAssignmentsError)}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 800 }}
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
					pageSizeOptions,
				}}
				loading={isBranchAssignmentsFetching}
			/>
		</div>
	);
};

const Filter = () => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branches },
		isFetching: isBranchesFetching,
		error: branchErrors,
	} = useBranches({
		params: { pageSize: MAX_PAGE_SIZE },
	});
	const {
		data: { users },
		isFetching: isUsersFetching,
		error: userErrors,
	} = useUsers({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	return (
		<>
			<RequestErrors
				errors={[
					...convertIntoArray(userErrors, 'Users'),
					...convertIntoArray(branchErrors, 'Branches'),
				]}
				withSpaceBottom
			/>

			<Row className="mb-4" gutter={[16, 16]}>
				<Col xs={24} sm={12}>
					<Label label="Branch" spacing />
					<Select
						className="w-100"
						value={params.branchId ? Number(params.branchId) : null}
						onChange={(value) => {
							setQueryParams({ branchId: value }, { shouldResetPage: true });
						}}
						optionFilterProp="children"
						filterOption={filterOption}
						disabled={isBranchesFetching}
						allowClear
						showSearch
					>
						{branches.map((branch) => (
							<Select.Option key={branch.id} value={branch.id}>
								{branch.name}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col xs={24} sm={12}>
					<Label label="User" spacing />
					<Select
						className="w-100"
						value={params.userId ? Number(params.userId) : null}
						onChange={(value) => {
							setQueryParams({ userId: value }, { shouldResetPage: true });
						}}
						optionFilterProp="children"
						filterOption={filterOption}
						disabled={isUsersFetching}
						allowClear
						showSearch
					>
						{users.map((user) => (
							<Select.Option key={user.id} value={user.id}>
								{getFullName(user)}
							</Select.Option>
						))}
					</Select>
				</Col>
				<Col lg={12} span={24}>
					<TimeRangeFilter />
				</Col>
			</Row>
		</>
	);
};
