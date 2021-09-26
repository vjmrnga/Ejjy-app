/* eslint-disable no-mixed-spaces-and-tabs */
import { Col, DatePicker, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { toString } from 'lodash';
import moment from 'moment';
import * as queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Content } from '../../../components';
import { Box, Label } from '../../../components/elements';
import { EMPTY_CELL, MAX_PAGE_SIZE } from '../../../global/constants';
import { pageSizeOptions } from '../../../global/options';
import { request } from '../../../global/types';
import { useBranches } from '../../../hooks/useBranches';
import { useLogs } from '../../../hooks/useLogs';
import { useQueryParams } from '../../../hooks/useQueryParams';
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

	const { setQueryParams } = useQueryParams({
		page: currentPage,
		pageSize,
		onQueryParamChange: (params) => {
			listLogs(params, true);
		},
	});

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

	return (
		<Content title="Logs">
			<section className="Logs">
				<Box>
					<Filter
						users={users}
						usersLoading={usersStatus === request.REQUESTING}
						branches={branches}
						branchesLoading={branchesStatus === request.REQUESTING}
						setQueryParams={(params) => {
							setQueryParams(params, { shouldResetPage: true });
						}}
					/>
					<Table
						columns={columns}
						dataSource={data}
						scroll={{ x: 1000 }}
						pagination={{
							current: currentPage,
							total: pageCount,
							pageSize,
							onChange: (page, newPageSize) => {
								setQueryParams({
									page,
									pageSize: newPageSize,
								});
							},
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
	usersLoading: boolean;
	branches: IBranch[];
	branchesLoading: boolean;
	setQueryParams: any;
}

const Filter = ({
	users,
	usersLoading,
	branches,
	branchesLoading,
	setQueryParams,
}: FilterProps) => {
	// CUSTOM HOOKS
	const history = useHistory();
	const params = queryString.parse(history.location.search);

	return (
		<Row className="PaddingHorizontal PaddingVertical" gutter={[15, 15]}>
			<Col lg={12} span={24}>
				<Label label="Branch" spacing />
				<Select
					style={{ width: '100%' }}
					onChange={(value) => {
						setQueryParams({ branchId: value });
					}}
					defaultValue={params.branchId}
					loading={branchesLoading}
					allowClear
				>
					{branches.map(({ id, name }) => (
						<Select.Option value={id}>{name}</Select.Option>
					))}
				</Select>
			</Col>

			<Col lg={12} span={24}>
				<Label label="User" spacing />
				<Select
					style={{ width: '100%' }}
					onChange={(value) => {
						setQueryParams({ actingUserId: value });
					}}
					defaultValue={params.actingUserId}
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
							setQueryParams({ timeRange: dateStrings.join(',') });
						}
					}}
					defaultValue={
						toString(params.timeRange).split(',')?.length === 2
							? [
									moment(toString(params.timeRange).split(',')[0]),
									moment(toString(params.timeRange).split(',')[1]),
							  ]
							: undefined
					}
					defaultPickerValue={
						toString(params.timeRange).split(',')?.length === 2
							? [
									moment(toString(params.timeRange).split(',')[0]),
									moment(toString(params.timeRange).split(',')[1]),
							  ]
							: undefined
					}
				/>
			</Col>
		</Row>
	);
};
