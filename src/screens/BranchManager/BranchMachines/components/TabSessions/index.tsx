import { Col, Radio, Row, Select, Table, Tag } from 'antd';
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
	branchMachineId: any;
}

export const TabSessions = ({ branchMachineId }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { sessions, total },
		error: sessionsError,
		isFetching: isSessionsFetching,
		isFetched: isSessionsFetched,
	} = useSessions({
		params: {
			...params,
			branchMachineId,
			timeRange: params?.timeRange || timeRangeTypes.DAILY,
			isAutomaticallyClosed: (() => {
				let isAutomaticallyClosed = undefined;
				if (params.closingType === closingTypes.AUTOMATIC) {
					isAutomaticallyClosed = true;
				} else if (params.closingType === closingTypes.MANUAL) {
					isAutomaticallyClosed = false;
				}

				return isAutomaticallyClosed;
			})(),
			isUnauthorized: (() => {
				let isUnauthorized = undefined;
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

			return {
				key: id,
				user: getFullName(user),
				datetime: renderDateTime({
					datetimeStarted,
					datetimeEnded,
					isAutomaticallyClosed,
				}),
				unauthorizedTimeRange: is_unauthorized_datetime_ended
					? renderDateTime({
							datetimeStarted,
							datetimeEnded: is_unauthorized_datetime_ended,
							isAutomaticallyClosed,
					  })
					: EMPTY_CELL,
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
		<div className="branch-session-column">
			<div className="first-row">
				<span className="label">Start: </span>
				<span className="value">
					{datetimeStarted
						? formatDateTimeShortMonth(datetimeStarted)
						: EMPTY_CELL}
				</span>
			</div>
			<div>
				<span className="label">End: </span>
				<span className="value">
					{datetimeEnded ? (
						<>
							{formatDateTimeShortMonth(datetimeEnded)}{' '}
							{isAutomaticallyClosed && <Tag color="blue">Auto</Tag>}
						</>
					) : (
						EMPTY_CELL
					)}
				</span>
			</div>
		</div>
	);

	return (
		<div className="ViewBranchMachineSessions">
			<TableHeader title="Sessions" />

			<Filter isLoading={isSessionsFetching && !isSessionsFetched} />

			<RequestErrors errors={convertIntoArray(sessionsError)} withSpaceBottom />

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 800 }}
				loading={isSessionsFetching && !isSessionsFetched}
				bordered
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
		isFetching: isUsersFetching,
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
					onChange={(value) => {
						setQueryParams({ userId: value }, { shouldResetPage: true });
					}}
					optionFilterProp="children"
					filterOption={filterOption}
					disabled={isUsersFetching || isLoading}
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
				<TimeRangeFilter disabled={isUsersFetching || isLoading} />
			</Col>

			<Col lg={12} span={24}>
				<Label label="Closing Type" spacing />
				<Radio.Group
					optionType="button"
					options={[
						{ label: 'All', value: closingTypes.ALL },
						{ label: 'Automatic', value: closingTypes.AUTOMATIC },
						{ label: 'Manual', value: closingTypes.MANUAL },
					]}
					onChange={(e) => {
						setQueryParams(
							{ closingType: e.target.value },
							{ shouldResetPage: true },
						);
					}}
					disabled={isUsersFetching || isLoading}
					defaultValue={params.closingType || closingTypes.ALL}
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Authorization" spacing />
				<Radio.Group
					optionType="button"
					options={[
						{ label: 'All', value: sessionTypes.ALL },
						{ label: 'Authorized', value: sessionTypes.AUTHORIZED },
						{ label: 'Unauthorized', value: sessionTypes.UNAUTHORIZED },
					]}
					onChange={(e) => {
						setQueryParams({ type: e.target.value }, { shouldResetPage: true });
					}}
					disabled={isUsersFetching || isLoading}
					defaultValue={params.type || sessionTypes.ALL}
				/>
			</Col>
		</Row>
	);
};
