import { Col, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader, TimeRangeFilter } from 'components';
import { Label } from 'components/elements';
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
import {
	convertIntoArray,
	filterOption,
	formatDateTimeExtended,
	getFullName,
} from 'utils';

const columns: ColumnsType = [
	{
		title: 'Branch Machine',
		dataIndex: 'branchMachine',
	},
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Description', dataIndex: 'description' },
	{ title: 'Date & Time', dataIndex: 'datetimeCreated' },
];

export const TabUserLogs = () => {
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
		const data = logs.map((log) => ({
			key: log.id,
			branchMachine: log?.branch_machine?.name || EMPTY_CELL,
			user: getFullName(log.acting_user),
			description: log.description,
			datetimeCreated: formatDateTimeExtended(log.datetime_created),
		}));

		setDataSource(data);
	}, [logs]);

	return (
		<div>
			<TableHeader title="Logs" wrapperClassName="pt-2 px-0" />

			<Filter
				branchMachines={branchMachines}
				isLoading={
					isFetchingLogs || isFetchingBranchMachines || isFetchingUsers
				}
				users={users}
			/>

			<RequestErrors
				className="px-6"
				errors={[
					...convertIntoArray(logsError, 'Logs'),
					...convertIntoArray(branchMachinesError, 'Branch Machines'),
					...convertIntoArray(usersError, 'Users'),
				]}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingLogs}
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
				scroll={{ x: 1000 }}
			/>
		</div>
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
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Branch Machine" spacing />
				<Select
					className="w-100"
					defaultValue={
						params.branchMachineId ? Number(params.branchMachineId) : null
					}
					filterOption={filterOption}
					loading={isLoading}
					optionFilterProp="children"
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams(
							{ branchMachineId: value },
							{ shouldResetPage: true },
						);
					}}
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
					className="w-100"
					defaultValue={
						params.actingUserId ? Number(params.actingUserId) : null
					}
					filterOption={filterOption}
					loading={isLoading}
					optionFilterProp="children"
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ actingUserId: value }, { shouldResetPage: true });
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
				<TimeRangeFilter disabled={isLoading} />
			</Col>
		</Row>
	);
};
