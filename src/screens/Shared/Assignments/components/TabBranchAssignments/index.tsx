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
			branch: branchAssignment.branch?.name,
			name: getFullName(branchAssignment.user),
			datetime: formatDateTime(branchAssignment.datetime_created),
		}));

		setDataSource(data);
	}, [branchAssignments]);

	return (
		<div>
			<TableHeader title="Branch Assignments" wrapperClassName="pt-2 px-0" />

			<Filter />

			<RequestErrors
				errors={convertIntoArray(branchAssignmentsError)}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isBranchAssignmentsFetching}
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
				scroll={{ x: 800 }}
			/>
		</div>
	);
};

const Filter = () => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branches },
		isFetching: isFetchingBranches,
		error: branchErrors,
	} = useBranches({
		params: { pageSize: MAX_PAGE_SIZE },
	});
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: userErrors,
	} = useUsers({
		params: {
			branchId: params.branchId,
			pageSize: MAX_PAGE_SIZE,
		},
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
				<Col sm={12} xs={24}>
					<Label label="Branch" spacing />
					<Select
						className="w-100"
						filterOption={filterOption}
						loading={isFetchingBranches}
						optionFilterProp="children"
						value={params.branchId ? Number(params.branchId) : null}
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams({ branchId: value }, { shouldResetPage: true });
						}}
					>
						{branches.map((branch) => (
							<Select.Option key={branch.id} value={branch.id}>
								{branch.name}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col sm={12} xs={24}>
					<Label label="User" spacing />
					<Select
						className="w-100"
						filterOption={filterOption}
						loading={isFetchingUsers}
						optionFilterProp="children"
						value={params.userId ? Number(params.userId) : null}
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams({ userId: value }, { shouldResetPage: true });
						}}
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
