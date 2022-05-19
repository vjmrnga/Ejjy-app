import { Col, Radio, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { RequestErrors, RequestWarnings, TableHeader } from 'components';
import { Label } from 'components/elements';
import { EMPTY_CELL } from 'global';
import { pageSizeOptions } from 'global';
import { request } from 'global';
import { useBranchesDays } from 'hooks/useBranchesDays';
import { useQueryParams } from 'hooks';
import { convertIntoArray, formatDateTimeShortMonth } from 'utils/function';

const columns: ColumnsType = [
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Date & Time', dataIndex: 'datetime' },
];

const branchDayTypes = {
	ALL: 'all',
	UNAUTHORIZED: 'unauthorized',
};

const closingTypes = {
	ALL: 'all',
	AUTOMATIC: 'automatic',
	MANUAL: 'manual',
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

	const { setQueryParams } = useQueryParams({
		page: currentPage,
		pageSize,
		onQueryParamChange: (params) => {
			let isAutomaticallyClosed = undefined;
			if (params.closingType) {
				isAutomaticallyClosed = params.closingType === closingTypes.AUTOMATIC;
			}

			listBranchDays(
				{
					...params,
					serverUrl,
					isUnauthorized:
						params.type === branchDayTypes.UNAUTHORIZED ? true : undefined,
					isAutomaticallyClosed,
				},
				true,
			);
		},
	});

	// METHODS
	useEffect(() => {
		const formattedBranchDays = branchDays.map((branchDay) => {
			const {
				id,
				started_by,
				ended_by,
				datetime_created,
				datetime_ended,
				is_automatically_closed,
			} = branchDay;

			return {
				key: id,
				user: renderUser(started_by, ended_by),
				datetime: renderDateTime({
					datetimeStarted: datetime_created,
					datetimeEnded: datetime_ended,
					isAutomaticallyClosed: is_automatically_closed,
				}),
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

	const renderDateTime = ({
		datetimeStarted,
		datetimeEnded,
		isAutomaticallyClosed,
	}) => (
		<div className="branch-day-column">
			<div className="first-row">
				<span className="label">Open: </span>
				<span className="value">
					{datetimeStarted
						? formatDateTimeShortMonth(datetimeStarted)
						: EMPTY_CELL}
				</span>
			</div>
			<div>
				<span className="label">Close: </span>
				<span className="value">
					{datetimeEnded
						? formatDateTimeShortMonth(datetimeEnded) +
						  `${isAutomaticallyClosed ? '(A)' : ''}`
						: EMPTY_CELL}
				</span>
			</div>
		</div>
	);

	return (
		<div className="ViewBranchMachineDays">
			<TableHeader title="Days" />

			<Filter />

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

const Filter = () => {
	const { params, setQueryParams } = useQueryParams();

	return (
		<Row className="mb-4" gutter={[16, 16]}>
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
					defaultValue={params.closingType || closingTypes.ALL}
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Authorization" spacing />

				<Radio.Group
					optionType="button"
					options={[
						{ label: 'All', value: branchDayTypes.ALL },
						{ label: 'Unauthorized', value: branchDayTypes.UNAUTHORIZED },
					]}
					onChange={(e) => {
						setQueryParams({ type: e.target.value }, { shouldResetPage: true });
					}}
					defaultValue={params.type || branchDayTypes.ALL}
				/>
			</Col>
		</Row>
	);
};
