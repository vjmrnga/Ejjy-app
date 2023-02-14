import { Col, Descriptions, Radio, Row, Select, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { RequestErrors, TableHeader, TimeRangeFilter } from 'components';
import { Label } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	MAX_PAGE_SIZE,
	pageSizeOptions,
	refetchOptions,
	timeRangeTypes,
} from 'global';
import { useQueryParams, useSessions, useUsers } from 'hooks';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	filterOption,
	formatDateTimeShortMonth,
	formatTimeRange,
	getFullName,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Date & Time', dataIndex: 'datetime' },
	{ title: 'Unauthorized Time Range', dataIndex: 'unauthorizedTimeRange' },
	{ title: 'Status', dataIndex: 'status' },
];

const sessionTypes = {
	ALL: 'all',
	AUTHORIZED: 'authorized',
	UNAUTHORIZED: 'unauthorized',
};

const closingTypes = {
	ALL: 'all',
	AUTOMATIC: 'automatic',
	MANUAL: 'manual',
};

interface Props {
	branch?: any;
	branchMachineId?: any;
}

export const TabSessions = ({ branch, branchMachineId }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { sessions, total },
		error: sessionsError,
		isFetching: isFetchingSessions,
		isFetched: isSessionsFetched,
	} = useSessions({
		params: {
			...params,
			branchId: branch?.id,
			branchMachineId,
			timeRange: params?.timeRange || timeRangeTypes.DAILY,
			isAutomaticallyClosed: (() => {
				let isAutomaticallyClosed;
				if (params.closingType === closingTypes.AUTOMATIC) {
					isAutomaticallyClosed = true;
				} else if (params.closingType === closingTypes.MANUAL) {
					isAutomaticallyClosed = false;
				}

				return isAutomaticallyClosed;
			})(),
			isUnauthorized: (() => {
				let isUnauthorized;
				if (params.type === sessionTypes.UNAUTHORIZED) {
					isUnauthorized = true;
				} else if (params.type === sessionTypes.AUTHORIZED) {
					isUnauthorized = false;
				}

				return isUnauthorized;
			})(),
		},
		options: refetchOptions,
	});

	// METHODS
	useEffect(() => {
		const data = sessions.map((session) => {
			const {
				id,
				user,
				datetime_started: datetimeStarted,
				datetime_ended: datetimeEnded,
				is_automatically_closed: isAutomaticallyClosed,
				is_unauthorized,
				is_unauthorized_datetime_ended,
			} = session;

			const datetime = renderDateTime({
				datetimeStarted,
				datetimeEnded,
				isAutomaticallyClosed,
			});

			let unauthorizedTimeRange: any = EMPTY_CELL;
			if (is_unauthorized_datetime_ended) {
				unauthorizedTimeRange = renderDateTime({
					datetimeStarted,
					datetimeEnded: is_unauthorized_datetime_ended,
					isAutomaticallyClosed,
				});
			} else if (is_unauthorized) {
				unauthorizedTimeRange = formatTimeRange(datetimeStarted, datetimeEnded);
			}

			return {
				key: id,
				user: getFullName(user),
				datetime,
				unauthorizedTimeRange,
				status: is_unauthorized ? (
					<Tag color="red">Unauthorized</Tag>
				) : (
					<Tag color="green">Authorized</Tag>
				),
			};
		});

		setDataSource(data);
	}, [sessions]);

	const renderDateTime = ({
		datetimeStarted,
		datetimeEnded,
		isAutomaticallyClosed,
	}) => (
		<Descriptions column={1} size="small" bordered>
			<Descriptions.Item label="Open">
				{datetimeStarted
					? formatDateTimeShortMonth(datetimeStarted)
					: EMPTY_CELL}
			</Descriptions.Item>
			<Descriptions.Item label="Close">
				{datetimeEnded ? (
					<>
						{formatDateTimeShortMonth(datetimeEnded)}{' '}
						{isAutomaticallyClosed && <Tag color="blue">Auto</Tag>}
					</>
				) : (
					EMPTY_CELL
				)}
			</Descriptions.Item>
		</Descriptions>
	);

	return (
		<div className="ViewBranchMachineSessions">
			<TableHeader title="Sessions" wrapperClassName="pt-2 px-0" />

			<Filter isLoading={isFetchingSessions && !isSessionsFetched} />

			<RequestErrors errors={convertIntoArray(sessionsError)} withSpaceBottom />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingSessions && !isSessionsFetched}
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

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => {
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { users },
		isFetching: isFetchingUsers,
	} = useUsers({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	return (
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="User" spacing />
				<Select
					className="w-100"
					defaultValue={params.userId}
					disabled={isFetchingUsers || isLoading}
					filterOption={filterOption}
					optionFilterProp="children"
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
				<TimeRangeFilter disabled={isFetchingUsers || isLoading} />
			</Col>

			<Col lg={12} span={24}>
				<Label label="Closing Type" spacing />
				<Radio.Group
					defaultValue={params.closingType || closingTypes.ALL}
					disabled={isFetchingUsers || isLoading}
					options={[
						{ label: 'All', value: closingTypes.ALL },
						{ label: 'Automatic', value: closingTypes.AUTOMATIC },
						{ label: 'Manual', value: closingTypes.MANUAL },
					]}
					optionType="button"
					onChange={(e) => {
						setQueryParams(
							{ closingType: e.target.value },
							{ shouldResetPage: true },
						);
					}}
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Authorization" spacing />
				<Radio.Group
					defaultValue={params.type || sessionTypes.ALL}
					disabled={isFetchingUsers || isLoading}
					options={[
						{ label: 'All', value: sessionTypes.ALL },
						{ label: 'Authorized', value: sessionTypes.AUTHORIZED },
						{ label: 'Unauthorized', value: sessionTypes.UNAUTHORIZED },
					]}
					optionType="button"
					onChange={(e) => {
						setQueryParams({ type: e.target.value }, { shouldResetPage: true });
					}}
				/>
			</Col>
		</Row>
	);
};
