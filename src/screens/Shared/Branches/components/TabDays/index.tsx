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
import { useBranchDays, useQueryParams, useUsers } from 'hooks';
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
	branch?: any;
	branchMachineId?: any;
}

export const TabDays = ({ branch, branchMachineId }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branchDays, total },
		error: branchDaysError,
		isFetching: isFetchingBranchDays,
		isFetched: isBranchDaysFetched,
	} = useBranchDays({
		params: {
			...params,
			branchId: branch?.id,
			branchMachineId,
			timeRange: params?.timeRange || timeRangeTypes.DAILY,
			isUnauthorized: (() => {
				let isUnauthorized;
				if (params.type === branchDayTypes.UNAUTHORIZED) {
					isUnauthorized = true;
				} else if (params.type === branchDayTypes.AUTHORIZED) {
					isUnauthorized = false;
				}

				return isUnauthorized;
			})(),
			isAutomaticallyClosed: (() => {
				let isAutomaticallyClosed;
				if (params.closingType === closingTypes.AUTOMATIC) {
					isAutomaticallyClosed = true;
				} else if (params.closingType === closingTypes.MANUAL) {
					isAutomaticallyClosed = false;
				}

				return isAutomaticallyClosed;
			})(),
		},
		options: refetchOptions,
	});

	// METHODS
	useEffect(() => {
		const data = branchDays.map((branchDay) => {
			const {
				id,
				started_by,
				ended_by,
				datetime_created: datetimeCreated,
				datetime_ended: datetimeEnded,
				is_automatically_closed: isAutomaticallyClosed,
				is_unauthorized,
				is_unauthorized_datetime_ended,
			} = branchDay;

			const datetime = renderDateTime({
				datetimeStarted: datetimeCreated,
				datetimeEnded,
				isAutomaticallyClosed,
			});

			let unauthorizedTimeRange: any = EMPTY_CELL;
			if (is_unauthorized_datetime_ended) {
				unauthorizedTimeRange = renderDateTime({
					datetimeStarted: datetimeCreated,
					datetimeEnded: is_unauthorized_datetime_ended,
					isAutomaticallyClosed,
				});
			} else if (is_unauthorized) {
				unauthorizedTimeRange = formatTimeRange(datetimeCreated, datetimeEnded);
			}

			return {
				key: id,
				user: renderUser({
					startedBy: started_by,
					endedBy: ended_by,
					isAutomaticallyClosed,
				}),
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
			<Descriptions column={1} size="small" bordered>
				<Descriptions.Item label="Open">
					{startedBy ? startedByUser : EMPTY_CELL}
				</Descriptions.Item>
				<Descriptions.Item label="Close">{endedByUser}</Descriptions.Item>
			</Descriptions>
		);
	};

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
		<div className="ViewBranchMachineDays">
			<TableHeader title="Days" wrapperClassName="pt-2 px-0" />

			<Filter isLoading={isFetchingBranchDays && !isBranchDaysFetched} />

			<RequestErrors
				errors={convertIntoArray(branchDaysError)}
				withSpaceBottom
			/>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingBranchDays && !isBranchDaysFetched}
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
				scroll={{ x: 650 }}
				bordered
			/>
		</div>
	);
};

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => {
	// CUSTOM HOOKS
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
				<Label label="Opened By" spacing />
				<Select
					className="w-100"
					defaultValue={params.openedByUserId}
					disabled={isFetchingUsers || isLoading}
					filterOption={filterOption}
					optionFilterProp="children"
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams(
							{ openedByUserId: value },
							{ shouldResetPage: true },
						);
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
				<Label label="Closed By" spacing />
				<Select
					className="w-100"
					defaultValue={params.closedByUserId}
					disabled={isFetchingUsers || isLoading}
					filterOption={filterOption}
					optionFilterProp="children"
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams(
							{ closedByUserId: value },
							{ shouldResetPage: true },
						);
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
					defaultValue={params.type || branchDayTypes.ALL}
					disabled={isFetchingUsers || isLoading}
					options={[
						{ label: 'All', value: branchDayTypes.ALL },
						{ label: 'Authorized', value: branchDayTypes.AUTHORIZED },
						{ label: 'Unauthorized', value: branchDayTypes.UNAUTHORIZED },
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
