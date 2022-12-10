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
	branch: any;
}

export const TabSessions = ({ branch }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { sessions, total },
		isFetching,
		error: listError,
	} = useSessions({
		params: {
			branchId: branch.id,
			timeRange: params?.timeRange || timeRangeTypes.DAILY,
			...params,
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
	});

	// METHODS
	useEffect(() => {
		const formattedBranchSession = sessions.map((session) => {
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

		setDataSource(formattedBranchSession);
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
			<TableHeader title="Sessions" wrapperClassName="pt-0" />

			<Filter isLoading={isFetching} />

			<RequestErrors errors={convertIntoArray(listError)} withSpaceBottom />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetching}
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
		isFetching,
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
					disabled={isFetching || isLoading}
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
				<TimeRangeFilter disabled={isFetching || isLoading} />
			</Col>

			<Col lg={12} span={24}>
				<Label label="Closing Type" spacing />
				<Radio.Group
					defaultValue={params.closingType || closingTypes.ALL}
					disabled={isFetching || isLoading}
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
					disabled={isFetching || isLoading}
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
