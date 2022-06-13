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
import { useBranchesDays } from 'hooks/useBranchesDays';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatDateTimeShortMonth, getFullName } from 'utils';

const columns: ColumnsType = [
	{ title: 'User', dataIndex: 'user' },
	{ title: 'Date & Time', dataIndex: 'datetime' },
	{ title: 'Unauthorized Time Range', dataIndex: 'unauthorizedTimeRange' },
	{ title: 'Status', dataIndex: 'status' },
];

const branchDayTypes = {
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

export const TabDays = ({ branchMachineId }: Props) => {
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
			if (params.closingType === closingTypes.AUTOMATIC) {
				isAutomaticallyClosed = true;
			} else if (params.closingType === closingTypes.MANUAL) {
				isAutomaticallyClosed = false;
			}

			let isUnauthorized = undefined;
			if (params.type === branchDayTypes.UNAUTHORIZED) {
				isUnauthorized = true;
			} else if (params.type === branchDayTypes.AUTHORIZED) {
				isUnauthorized = false;
			}

			listBranchDays(
				{
					...params,
					branchMachineId,
					isUnauthorized,
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
				is_automatically_closed: isAutomaticallyClosed,
				is_unauthorized,
				is_unauthorized_datetime_ended,
			} = branchDay;

			return {
				key: id,
				user: renderUser({
					startedBy: started_by,
					endedBy: ended_by,
					isAutomaticallyClosed,
				}),
				datetime: renderDateTime({
					datetimeStarted: datetime_created,
					datetimeEnded: datetime_ended,
					isAutomaticallyClosed,
				}),
				unauthorizedTimeRange: is_unauthorized_datetime_ended
					? renderDateTime({
							datetimeStarted: datetime_created,
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

		setData(formattedBranchDays);
	}, [branchDays]);

	const renderUser = ({ startedBy, endedBy, isAutomaticallyClosed }) => {
		const startedByUser = startedBy ? getFullName(startedBy) : EMPTY_CELL;

		let endedByUser: any = EMPTY_CELL;
		if (isAutomaticallyClosed) {
			endedByUser = <Tag color="blue">Auto</Tag>;
		} else if (endedBy) {
			endedByUser = getFullName(endedBy);
		}

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
					<span className="value">{endedByUser}</span>
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
	// CUSTOM HOOKS
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
				<Label label="Opened By" spacing />
				<Select
					className="w-100"
					onChange={(value) => {
						setQueryParams(
							{ openedByUserId: value },
							{ shouldResetPage: true },
						);
					}}
					defaultValue={params.openedByUserId}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					disabled={isFetching}
					showSearch
					allowClear
				>
					{users.map((user) => (
						<Select.Option key={user.id} value={user.id}>
							{getFullName(user)}
						</Select.Option>
					))}
				</Select>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Closed By" spacing />
				<Select
					className="w-100"
					onChange={(value) => {
						setQueryParams(
							{ closedByUserId: value },
							{ shouldResetPage: true },
						);
					}}
					defaultValue={params.closedByUserId}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					disabled={isFetching}
					showSearch
					allowClear
				>
					{users.map((user) => (
						<Select.Option key={user.id} value={user.id}>
							{getFullName(user)}
						</Select.Option>
					))}
				</Select>
			</Col>

			<Col lg={12} span={24}>
				<TimeRangeFilter />
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
					defaultValue={params.closingType || closingTypes.ALL}
				/>
			</Col>

			<Col lg={12} span={24}>
				<Label label="Authorization" spacing />

				<Radio.Group
					optionType="button"
					options={[
						{ label: 'All', value: branchDayTypes.ALL },
						{ label: 'Authorized', value: branchDayTypes.AUTHORIZED },
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
