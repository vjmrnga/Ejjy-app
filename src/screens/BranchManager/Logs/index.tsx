/* eslint-disable no-mixed-spaces-and-tabs */
import { Col, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	Content,
	RequestErrors,
	TableHeader,
	TimeRangeFilter,
} from 'components';
import { Box, Label } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	MAX_PAGE_SIZE,
	pageSizeOptions,
} from 'global';
import { useBranchMachines, useQueryParams, useUsers } from 'hooks';
import useUserLogs from 'hooks/useUserLogs';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatDateTimeExtended, getFullName } from 'utils';

const columns: ColumnsType = [
	{
		title: 'Branch Machine',
		dataIndex: 'branchMachine',
	},
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Description', dataIndex: 'description' },
	{ title: 'Date & Time', dataIndex: 'datetimeCreated' },
];

export const Logs = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branchMachines },
		isFetching: isFetchingBranchMachines,
		error: branchMachinesError,
	} = useBranchMachines({
		params: { pageSize: MAX_PAGE_SIZE },
	});
	const {
		data: { users },
		isFetching: isFetchingUsers,
		error: usersError,
	} = useUsers({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	const {
		data: { logs, total },
		isFetching: isFetchingLogs,
		error: logsError,
	} = useUserLogs({ params });

	// METHODS
	useEffect(() => {
		const formattedLogs = logs.map((log) => ({
			key: log.id,
			branchMachine: log?.branch_machine?.name || EMPTY_CELL,
			user: getFullName(log.acting_user),
			description: log.description,
			datetimeCreated: formatDateTimeExtended(log.datetime_created),
		}));

		setDataSource(formattedLogs);
	}, [logs]);

	return (
		<Content title="Logs">
			<section className="Logs">
				<Box>
					<TableHeader title="Logs" />

					<RequestErrors
						className="px-6"
						errors={[
							...convertIntoArray(logsError, 'Logs'),
							...convertIntoArray(branchMachinesError, 'Branch Machines'),
							...convertIntoArray(usersError, 'Users'),
						]}
						withSpaceTop
						withSpaceBottom
					/>

					<Filter
						isLoading={
							isFetchingLogs || isFetchingBranchMachines || isFetchingUsers
						}
						branchMachines={branchMachines}
						users={users}
					/>

					<Table
						columns={columns}
						dataSource={dataSource}
						scroll={{ x: 1000 }}
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
						loading={isFetchingLogs}
					/>
				</Box>
			</section>
		</Content>
	);
};

interface FilterProps {
	branchMachines: any;
	isLoading: boolean;
	users: any;
}

const Filter = ({ branchMachines, isLoading, users }: FilterProps) => {
	const { params, setQueryParams } = useQueryParams();

	return (
		<Row className="PaddingHorizontal PaddingVertical" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Branch Machine" spacing />
				<Select
					style={{ width: '100%' }}
					onChange={(value) => {
						setQueryParams(
							{ branchMachineId: value },
							{ shouldResetPage: true },
						);
					}}
					defaultValue={
						params.branchMachineId ? Number(params.branchMachineId) : null
					}
					loading={isLoading}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					showSearch
					allowClear
				>
					{branchMachines.map(({ id, name }) => (
						<Select.Option key={id} value={id}>
							{name}
						</Select.Option>
					))}
				</Select>
			</Col>

			<Col lg={12} span={24}>
				<Label label="User" spacing />
				<Select
					style={{ width: '100%' }}
					onChange={(value) => {
						setQueryParams({ actingUserId: value }, { shouldResetPage: true });
					}}
					defaultValue={
						params.actingUserId ? Number(params.actingUserId) : null
					}
					loading={isLoading}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					showSearch
					allowClear
				>
					{users.map((user) => (
						<Select.Option key={user.id} value={user.id}>
							{getFullName(user)}
						</Select.Option>
					))}
				</Select>
			</Col>

			<Col lg={12} span={24}>
				<TimeRangeFilter disabled={isLoading} />
			</Col>
		</Row>
	);
};
