import { Col, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	ConnectivityType,
	RequestErrors,
	TableHeader,
	TimeRangeFilter,
} from 'components';
import { Label } from 'components/elements';
import {
	connectivityTypes,
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	pageSizeOptions,
	timeRangeTypes,
} from 'global';
import { useConnectivityLogs, useQueryParams } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, filterOption, formatDateTime } from 'utils';

const columns: ColumnsType = [
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Date & Time Created', dataIndex: 'datetime' },
];

interface Props {
	branch: any;
}

export const TabConnectivityLogs = ({ branch }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { connectivityLogs, total },
		isFetching: isFetchingConnectivityLogs,
		error: connectivityLogsError,
	} = useConnectivityLogs({
		params: {
			branch_id: branch.id,
			...params,
		},
	});

	// METHODS
	useEffect(() => {
		const data = connectivityLogs.map((connectivityLog) => ({
			key: connectivityLog.id,
			type: <ConnectivityType type={connectivityLog.type} />,
			datetime: formatDateTime(connectivityLog.datetime_created),
		}));

		setDataSource(data);
	}, [connectivityLogs]);

	return (
		<>
			<TableHeader title="Connectivity Logs" wrapperClassName="pt-2 px-0" />

			<Filter isLoading={isFetchingConnectivityLogs} />

			<RequestErrors errors={convertIntoArray(connectivityLogsError)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingConnectivityLogs}
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
				bordered
			/>
		</>
	);
};

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => {
	const { params, setQueryParams } = useQueryParams();

	return (
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<TimeRangeFilter
					disabled={isLoading}
					fields={[timeRangeTypes.DATE_RANGE]}
				/>
			</Col>
			<Col lg={12} span={24}>
				<Label label="Type" spacing />
				<Select
					className="w-100"
					disabled={isLoading}
					filterOption={filterOption}
					optionFilterProp="children"
					value={params.type}
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ type: value }, { shouldResetPage: true });
					}}
				>
					<Select.Option
						key={connectivityTypes.OFFLINE_TO_ONLINE}
						value={connectivityTypes.OFFLINE_TO_ONLINE}
					>
						Offline to Online
					</Select.Option>
					<Select.Option
						key={connectivityTypes.ONLINE_TO_OFFLINE}
						value={connectivityTypes.ONLINE_TO_OFFLINE}
					>
						Online to Offline
					</Select.Option>
				</Select>
			</Col>
		</Row>
	);
};
