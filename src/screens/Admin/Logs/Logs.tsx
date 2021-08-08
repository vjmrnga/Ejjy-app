import { Col, DatePicker, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Content } from '../../../components';
import { Box, Label } from '../../../components/elements';
import { EMPTY_CELL, MAX_PAGE_SIZE } from '../../../global/constants';
import { pageSizeOptions } from '../../../global/options';
import { request } from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { useLogs } from '../../../hooks/useLogs';
import { useUsers } from '../../../hooks/useUsers';
import { IBranch, IUser } from '../../../models';
import { formatDateTimeExtended } from '../../../utils/function';

const columns: ColumnsType = [
	{ title: 'Branch', dataIndex: 'branch', width: 150, fixed: 'left' },
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Description', dataIndex: 'description' },
	{ title: 'Date & Time', dataIndex: 'datetime_created' },
];

export const Logs = () => {
	// STATES
	const [data, setData] = useState([]);
	const [branchId, setBranchId] = useState(null);
	const [userId, setUserId] = useState(null);
	const [timeRange, setTimeRange] = useState(null);

	// CUSTOM HOOKS
	const { branches, getBranches, status: branchesStatus } = useBranches();
	const { users, getOnlineUsers, status: usersStatus } = useUsers();
	const {
		logs,
		pageCount,
		currentPage,
		pageSize,
		listLogs,
		status: logsStatus,
	} = useLogs();

	useEffect(() => {
		listLogs({ page: 1 });
	}, []);

	// METHODS
	useEffect(() => {
		getBranches();
		getOnlineUsers({ page: 1, pageSize: MAX_PAGE_SIZE });
	}, []);

	useEffect(() => {
		const formattedLogs =
			logs?.map((log) => ({
				branch: log?.branch?.name || EMPTY_CELL,
				user: log.acting_user
					? `${log.acting_user.first_name} ${log.acting_user.last_name}`
					: EMPTY_CELL,
				description: log.description,
				datetime_created: formatDateTimeExtended(log.datetime_created),
			})) || [];

		setData(formattedLogs);
	}, [logs]);

	const onPageChange = (page, newPageSize) => {
		listLogs(
			{
				branchId,
				actingUserId: userId,
				timeRange,
				page,
				pageSize: newPageSize,
			},
			newPageSize !== pageSize,
		);
	};

	const onSelectUser = (value) => {
		listLogs(
			{
				branchId,
				actingUserId: value,
				timeRange,
				page: 1,
			},
			true,
		);

		setUserId(value);
	};

	const onSelectBranch = (value) => {
		listLogs(
			{
				branchId: value,
				actingUserId: userId,
				timeRange,
				page: 1,
			},
			true,
		);

		setBranchId(value);
	};

	const onSelectDateRange = (value) => {
		listLogs(
			{
				branchId,
				actingUserId: userId,
				timeRange: value,
				page: 1,
			},
			true,
		);

		setTimeRange(value);
	};

	return (
		<Content title="Logs">
			<section className="Logs">
				<Box>
					<Filter
						users={users}
						onSelectUser={onSelectUser}
						usersLoading={usersStatus === request.REQUESTING}
						branches={branches}
						onSelectBranch={onSelectBranch}
						branchesLoading={branchesStatus === request.REQUESTING}
						onSelectDateRange={onSelectDateRange}
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
							pageSizeOptions,
						}}
						loading={logsStatus === request.REQUESTING}
					/>
				</Box>
			</section>
		</Content>
	);
};

interface FilterProps {
	users: IUser[];
	onSelectUser: any;
	usersLoading: boolean;
	branches: IBranch[];
	onSelectBranch: any;
	branchesLoading: boolean;
	onSelectDateRange: any;
}

const Filter = ({
	users,
	onSelectUser,
	usersLoading,
	branches,
	onSelectBranch,
	branchesLoading,
	onSelectDateRange,
}: FilterProps) => (
	<Row className="PaddingHorizontal PaddingVertical" gutter={[15, 15]}>
		<Col lg={12} span={24}>
			<Label label="Branches" spacing />
			<Select
				style={{ width: '100%' }}
				onChange={onSelectBranch}
				loading={branchesLoading}
				allowClear
			>
				{branches.map(({ id, name }) => (
					<Select.Option value={id}>{name}</Select.Option>
				))}
			</Select>
		</Col>

		<Col lg={12} span={24}>
			<Label label="Users" spacing />
			<Select
				style={{ width: '100%' }}
				onChange={onSelectUser}
				loading={usersLoading}
				allowClear
			>
				{users.map(({ id, first_name, last_name }) => (
					<Select.Option value={id}>
						{`${first_name} ${last_name}`}
					</Select.Option>
				))}
			</Select>
		</Col>

		<Col lg={12} span={24}>
			<Label label="Date Range" spacing />
			<DatePicker.RangePicker
				style={{ width: '100%' }}
				format="MM/DD/YY"
				onCalendarChange={(dates, dateStrings) => {
					if (dates?.[0] && dates?.[1]) {
						onSelectDateRange(dateStrings.join(','));
					}
				}}
			/>
		</Col>
	</Row>
);
