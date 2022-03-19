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
import { useBranchesDays } from '../../../../../hooks/useBranchesDays';
import { useQueryParams } from '../../../../../hooks/useQueryParams';
import {
	convertIntoArray,
	formatDateTimeShortMonth,
} from '../../../../../utils/function';

const columns: ColumnsType = [
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Date & Time', dataIndex: 'datetime' },
];

const branchDayTypes = {
	ALL: 'all',
	UNAUTHORIZED: 'unauthorized',
};

interface Props {
	serverUrl: any;
}

export const TabDays = ({ serverUrl }: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		branchDays,
		pageCount,
		pageSize,
		currentPage,

		listBranchDays,
		status,
		errors,
		warnings,
	} = useBranchesDays();

	const { params: queryParams, setQueryParams } = useQueryParams({
		page: currentPage,
		pageSize,
		onQueryParamChange: (params) => {
			listBranchDays(
				{
					...params,
					serverUrl,
					isUnauthorized:
						params.type === branchDayTypes.UNAUTHORIZED ? true : undefined,
				},
				true,
			);
		},
	});

	// METHODS
	useEffect(() => {
		const formattedBranchDays = branchDays.map((branchDay) => {
			const { id, started_by, ended_by, datetime_created, datetime_ended } =
				branchDay;

			return {
				key: id,
				user: renderUser(started_by, ended_by),
				datetime: renderDateTime(datetime_created, datetime_ended),
			};
		});

		setData(formattedBranchDays);
	}, [branchDays]);

	const renderUser = (startedBy, endedBy) => {
		const startedByUser = startedBy
			? `${startedBy.first_name} ${startedBy.last_name}`
			: EMPTY_CELL;
		const endedByUser = endedBy
			? `${endedBy.first_name} ${endedBy.last_name}`
			: EMPTY_CELL;

		return (
			<div className="branch-day-column">
				<div className="first-row">
					<span className="label">Open: </span>
					<span className="value">
						{startedBy ? startedByUser : EMPTY_CELL}
					</span>
				</div>
				<div>
					<span className="label">Close: </span>
					<span className="value">{endedBy ? endedByUser : EMPTY_CELL}</span>
				</div>
			</div>
		);
	};

	const renderDateTime = (datetime_created, datetime_ended) => (
		<div className="branch-day-column">
			<div className="first-row">
				<span className="label">Open: </span>
				<span className="value">
					{datetime_created
						? formatDateTimeShortMonth(datetime_created)
						: EMPTY_CELL}
				</span>
			</div>
			<div>
				<span className="label">Close: </span>
				<span className="value">
					{datetime_ended
						? formatDateTimeShortMonth(datetime_ended)
						: EMPTY_CELL}
				</span>
			</div>
		</div>
	);

	return (
		<div className="ViewBranchMachineDays">
			<TableHeader title="Days" />

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
					{ label: 'All', value: branchDayTypes.ALL },
					{ label: 'Unauthorized', value: branchDayTypes.UNAUTHORIZED },
				]}
				onChange={(e) => {
					setQueryParams({ type: e.target.value });
				}}
				defaultValue={params.type || branchDayTypes.ALL}
			/>
		</Col>
	</Row>
);
