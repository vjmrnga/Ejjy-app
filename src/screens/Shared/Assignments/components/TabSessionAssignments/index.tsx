import { Col, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader, TimeRangeFilter } from 'components';
import { Label } from 'components/elements';
import dayjs from 'dayjs';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	pageSizeOptions,
	timeRangeTypes,
} from 'global';
import {
	useBranches,
	useCashieringAssignments,
	useQueryParams,
	useUsers,
} from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, filterOption, formatTime, getFullName } from 'utils';

const columns: ColumnsType = [
	{ title: 'Branch Machine', dataIndex: 'branchMachine' },
	{ title: 'Name', dataIndex: 'name' },
	{ title: 'Date', dataIndex: 'date' },
	{ title: 'Time', dataIndex: 'time' },
];

export const TabSessionAssignments = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { cashieringAssignments, total },
		isFetching: isCashieringAssignmentsFetching,
		error: cashieringAssignmentsError,
	} = useCashieringAssignments({
		params: {
			...params,
			timeRange: params?.timeRange || timeRangeTypes.DAILY,
		},
	});

	// METHODS
	useEffect(() => {
		const data = cashieringAssignments.map((assignment) => ({
			key: assignment.id,
			branchMachine: `${assignment.branch_machine.branch.name} - ${assignment.branch_machine.name}`,
			name: getFullName(assignment.user),
			date: dayjs.tz(assignment.datetime_start).format('MMMM DD, YYYY'),
			time: `${formatTime(assignment.datetime_start)} – ${formatTime(
				assignment.datetime_end,
			)}`,
		}));

		setDataSource(data);
	}, [cashieringAssignments]);

	return (
		<div>
			<TableHeader
				title="Cashiering Assignments"
				wrapperClassName="pt-2 px-0"
			/>

			<Filter />

			<RequestErrors
				errors={convertIntoArray(cashieringAssignmentsError)}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isCashieringAssignmentsFetching}
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
		isFetching: isBranchesFetching,
		error: branchError,
	} = useBranches({
		params: { pageSize: MAX_PAGE_SIZE },
	});
	const {
		data: { users },
		isFetching: isUsersFetching,
		error: userError,
	} = useUsers({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	return (
		<>
			<RequestErrors
				errors={[
					...convertIntoArray(userError, 'Users'),
					...convertIntoArray(branchError, 'Branches'),
				]}
				withSpaceBottom
			/>

			<Row className="mb-4" gutter={[16, 16]}>
				<Col sm={12} xs={24}>
					<Label label="Branch" spacing />
					<Select
						className="w-100"
						disabled={isBranchesFetching}
						filterOption={filterOption}
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
						disabled={isUsersFetching}
						filterOption={filterOption}
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
