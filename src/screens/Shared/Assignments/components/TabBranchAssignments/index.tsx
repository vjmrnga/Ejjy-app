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
import { useUserStore } from 'stores';
import {
	convertIntoArray,
	filterOption,
	formatDateTime,
	getFullName,
	getLocalBranchId,
	isUserFromBranch,
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
	const user = useUserStore((state) => state.user);
	const {
		data: { branchAssignments, total },
		isFetching: isFetchingBranchAssignments,
		error: branchAssignmentsError,
	} = useBranchAssignments({
		params: {
			...params,
			branchId: isUserFromBranch(user.user_type)
				? getLocalBranchId()
				: params?.branchId,
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

			<RequestErrors
				errors={convertIntoArray(branchAssignmentsError)}
				withSpaceBottom
			/>

			<Filter />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingBranchAssignments}
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
				bordered
			/>
		</div>
	);
};

const Filter = () => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const user = useUserStore((state) => state.user);
	const {
		data: { branches },
		isFetching: isFetchingBranches,
		error: branchesError,
	} = useBranches({
		params: { pageSize: MAX_PAGE_SIZE },
		options: { enabled: !isUserFromBranch(user.user_type) },
	});
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: usersError,
	} = useUsers({
		params: {
			branchId: isUserFromBranch(user.user_type)
				? getLocalBranchId()
				: params.branchId,
			pageSize: MAX_PAGE_SIZE,
		},
	});

	return (
		<>
			<RequestErrors
				errors={[
					...convertIntoArray(usersError, 'Users'),
					...convertIntoArray(branchesError, 'Branches'),
				]}
				withSpaceBottom
			/>

			<Row className="mb-4" gutter={[16, 16]}>
				{!isUserFromBranch(user.user_type) && (
					<Col md={12}>
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
				)}

				<Col md={12}>
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
						{users.map((u) => (
							<Select.Option key={u.id} value={u.id}>
								{getFullName(u)}
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
