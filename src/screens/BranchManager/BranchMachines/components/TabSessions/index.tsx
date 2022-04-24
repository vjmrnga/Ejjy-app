import { Col, Radio, Row, Select, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	RequestErrors,
	RequestWarnings,
	TableHeader,
	TimeRangeFilter,
} from 'components';
import { Label } from 'components/elements';
import { EMPTY_CELL, MAX_PAGE_SIZE, pageSizeOptions, request } from 'global';
import { useQueryParams, useUsers } from 'hooks';
import { useSessions } from 'hooks/useSessions';
import React, { useCallback, useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatDateTimeShortMonth,
	getFullName,
} from 'utils/function';

const columns: ColumnsType = [
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Date & Time', dataIndex: 'datetime' },
	{ title: 'Unauthorized Time Range', dataIndex: 'unauthorizedTimeRange' },
	{ title: 'Status', dataIndex: 'status' },
];

const sessionTypes = {
	ALL: 'all',
	UNAUTHORIZED: 'unauthorized',
};

interface Props {
	serverUrl: any;
}

export const TabSessions = ({ serverUrl }: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		sessions,
		pageCount,
		currentPage,
		pageSize,
		listSessions,
		status,
		errors,
		warnings,
	} = useSessions();
	const { setQueryParams } = useQueryParams({
		page: currentPage,
		pageSize,
		onQueryParamChange: (params) => {
			listSessions(
				{
					...params,
					serverUrl,
					isUnauthorized:
						params.type === sessionTypes.UNAUTHORIZED ? true : undefined,
				},
				true,
			);
		},
	});

	// METHODS
	useEffect(() => {
		const formattedBranchSession = sessions.map((session) => {
			const {
				id,
				user,
				datetime_started,
				datetime_ended,
				is_unauthorized,
				is_unauthorized_datetime_ended,
			} = session;

			return {
				key: id,
				user: getFullName(user),
				datetime: renderDateTime(datetime_started, datetime_ended),
				unauthorizedTimeRange: is_unauthorized_datetime_ended
					? renderDateTime(datetime_started, is_unauthorized_datetime_ended)
					: EMPTY_CELL,
				status: <Status isAuthorized={!is_unauthorized} />,
			};
		});

		setData(formattedBranchSession);
	}, [sessions]);

	const renderDateTime = (datetime_started, datetime_ended) => (
		<div className="branch-session-column">
			<div className="first-row">
				<span className="label">Start: </span>
				<span className="value">
					{datetime_started
						? formatDateTimeShortMonth(datetime_started)
						: EMPTY_CELL}
				</span>
			</div>
			<div>
				<span className="label">End: </span>
				<span className="value">
					{datetime_ended
						? formatDateTimeShortMonth(datetime_ended)
						: EMPTY_CELL}
				</span>
			</div>
		</div>
	);

	return (
		<div className="ViewBranchMachineSessions">
			<TableHeader title="Sessions" />

			<Filter serverUrl={serverUrl} isLoading={status === request.REQUESTING} />

			<RequestErrors errors={convertIntoArray(errors)} />
			<RequestWarnings warnings={convertIntoArray(warnings)} />

			<Table
				columns={columns}
				dataSource={data}
				scroll={{ x: 650 }}
				pagination={{
					current: currentPage,
					total: pageCount,
					pageSize,
					onChange: (page, newPageSize) => {
						setQueryParams(
							{
								page,
								pageSize: newPageSize,
							},
							{ shouldResetPage: true },
						);
					},
					disabled: !data,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				loading={status === request.REQUESTING}
			/>
		</div>
	);
};

interface FilterProps {
	serverUrl: string;
	isLoading: boolean;
}

const Filter = ({ serverUrl, isLoading }: FilterProps) => {
	const { params, setQueryParams } = useQueryParams();

	const {
		data: { users },
		isFetching,
	} = useUsers({
		params: {
			serverUrl,
			pageSize: MAX_PAGE_SIZE,
		},
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
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					disabled={isFetching}
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
				<Label label="Type" spacing />
				<Radio.Group
					optionType="button"
					options={[
						{ label: 'All', value: sessionTypes.ALL },
						{ label: 'Unauthorized', value: sessionTypes.UNAUTHORIZED },
					]}
					onChange={(e) => {
						setQueryParams({ type: e.target.value }, { shouldResetPage: true });
					}}
					disabled={isLoading}
					defaultValue={params.type || sessionTypes.ALL}
				/>
			</Col>

			<Col lg={12} span={24}>
				<TimeRangeFilter disabled={isLoading} />
			</Col>
		</Row>
	);
};

interface StatusProps {
	isAuthorized: boolean;
}

const Status = ({ isAuthorized }: StatusProps) => {
	const render = useCallback(() => {
		return isAuthorized ? (
			<Tag color="green">Authorized</Tag>
		) : (
			<Tag color="red">Unauthorized</Tag>
		);
	}, [isAuthorized]);

	return render();
};
