import { Col, Radio, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import {
	RequestErrors,
	RequestWarnings,
	TableHeader,
} from '../../../../../components';
import { Label } from '../../../../../components/elements';
import { EMPTY_CELL } from '../../../../../global/constants';
import { pageSizeOptions } from '../../../../../global/options';
import { request } from '../../../../../global/types';
import { useQueryParams } from '../../../../../hooks/useQueryParams';
import { useSessions } from '../../../../../hooks/useSessions';
import {
	convertIntoArray,
	formatDateTimeShortMonth,
} from '../../../../../utils/function';

const columns: ColumnsType = [
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Date & Time', dataIndex: 'datetime' },
	{ title: 'Unauthorized Time Range', dataIndex: 'unauthorized_time_range' },
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

	const { params: queryParams, setQueryParams } = useQueryParams({
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
				is_unauthorized_datetime_ended,
			} = session;

			return {
				key: id,
				user: `${user.first_name} ${user.last_name}`,
				datetime: renderDateTime(datetime_started, datetime_ended),
				unauthorized_time_range: is_unauthorized_datetime_ended
					? renderDateTime(datetime_started, is_unauthorized_datetime_ended)
					: EMPTY_CELL,
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

			<Filter
				params={queryParams}
				setQueryParams={(params) => {
					setQueryParams(params, { shouldResetPage: true });
				}}
			/>

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
						setQueryParams({
							page,
							pageSize: newPageSize,
						});
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
	params: any;
	setQueryParams: any;
}

const Filter = ({ params, setQueryParams }: FilterProps) => (
	<Row className="mb-4" gutter={[15, 15]}>
		<Col lg={12} span={24}>
			<Label label="Type" spacing />
			<Radio.Group
				optionType="button"
				options={[
					{ label: 'All', value: sessionTypes.ALL },
					{ label: 'Unauthorized', value: sessionTypes.UNAUTHORIZED },
				]}
				onChange={(e) => {
					setQueryParams({ type: e.target.value });
				}}
				defaultValue={params.type || sessionTypes.ALL}
			/>
		</Col>
	</Row>
);
