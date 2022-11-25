import { Col, Radio, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Content, RequestErrors, TimeRangeFilter } from 'components';
import { Box, Label } from 'components/elements';
import {
	accountTypes,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	dtrTypes,
	MAX_PAGE_SIZE,
	pageSizeOptions,
} from 'global';
import {
	useAccounts,
	useAttendanceLogs,
	useAuth,
	useBranches,
	useQueryParams,
} from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	filterOption,
	formatDateTime,
	getFullName,
	getLocalBranchId,
	isUserFromBranch,
} from 'utils';

export const tabs = {
	ATTENDANCE: 'Attendance',
	TRACKER: 'Tracker',
};

const columns: ColumnsType = [
	{ title: 'Employee Name', dataIndex: 'name' },
	{
		title: 'Date & Time',
		children: [
			{
				title: 'Scheduled',
				dataIndex: 'scheduledDateTime',
			},
			{
				title: 'Real',
				dataIndex: 'realDateTime',
			},
		],
	},
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Description', dataIndex: 'description' },
];

export const DTR = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const { user } = useAuth();
	const {
		data: { attendanceLogs, total },
		isFetching: isFetchingAttendanceLogs,
		error: attendanceLogsError,
	} = useAttendanceLogs({
		params: {
			...params,
			branchId: isUserFromBranch(user.user_type)
				? getLocalBranchId()
				: params?.branchId,
		},
	});

	// METHODS
	useEffect(() => {
		const data = attendanceLogs.map((log) => ({
			key: log.id,
			name: getFullName(log.employee),
			scheduledDateTime: formatDateTime(log.scheduled_time),
			realDateTime: formatDateTime(log.real_time),
			type: _.upperFirst(log.attendance_category),
			description: getLogDescription(
				log.attendance_category,
				log.attendance_type,
			),
		}));

		setDataSource(data);
	}, [attendanceLogs]);

	const getLogDescription = (category, type) => {
		let description = '';

		if (category === dtrTypes.ATTENDANCE) {
			description = 'Clock';
		} else if (category === dtrTypes.TRACKER) {
			description = 'Time';
		}

		return description + _.upperFirst(type);
	};

	return (
		<Content title="Daily Time Record">
			<Box>
				<Filter />

				<RequestErrors
					errors={convertIntoArray(attendanceLogsError)}
					withSpaceBottom
				/>

				<Table
					columns={columns}
					dataSource={dataSource}
					loading={isFetchingAttendanceLogs}
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
			</Box>
		</Content>
	);
};

const Filter = () => {
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const { user } = useAuth();
	const {
		data: { branches },
		isFetching: isFetchingBranches,
		error: branchErrors,
	} = useBranches({
		params: { pageSize: MAX_PAGE_SIZE },
	});
	const {
		data: { accounts },
		isFetching: isFetchingAccounts,
		error: accountErrors,
	} = useAccounts({
		params: { type: accountTypes.EMPLOYEE, pageSize: MAX_PAGE_SIZE },
	});

	return (
		<div className="pa-6">
			<RequestErrors
				errors={[
					...convertIntoArray(accountErrors, 'Users'),
					...convertIntoArray(branchErrors, 'Branches'),
				]}
				withSpaceBottom
			/>

			<Row gutter={[16, 16]}>
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
					<Label label="Employee" spacing />
					<Select
						className="w-100"
						filterOption={filterOption}
						loading={isFetchingAccounts}
						optionFilterProp="children"
						value={params.employeeId ? Number(params.employeeId) : null}
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams({ employeeId: value }, { shouldResetPage: true });
						}}
					>
						{accounts.map((employee) => (
							<Select.Option key={employee.id} value={employee.id}>
								{getFullName(employee)}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col md={12}>
					<TimeRangeFilter />
				</Col>

				<Col md={12}>
					<Label label="Type" spacing />
					<Radio.Group
						defaultValue={null}
						options={[
							{ label: 'All', value: null },
							{ label: 'Attendance', value: dtrTypes.ATTENDANCE },
							{
								label: 'Tracker',
								value: dtrTypes.TRACKER,
							},
						]}
						optionType="button"
						value={params.attendanceCategory}
						onChange={(e) => {
							setQueryParams(
								{ attendanceCategory: e.target.value },
								{ shouldResetPage: true },
							);
						}}
					/>
				</Col>
			</Row>
		</div>
	);
};
