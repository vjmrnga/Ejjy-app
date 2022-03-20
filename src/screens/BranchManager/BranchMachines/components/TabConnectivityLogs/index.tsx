import { Col, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import {
	ConnectivityType,
	RequestErrors,
	TableHeader,
	TimeRangeFilter,
} from '../../../../../components';
import { Label } from '../../../../../components/elements';
import { pageSizeOptions } from '../../../../../global/options';
import { connectivityTypes } from '../../../../../global/types';
import { useConnectivityLogs } from '../../../../../hooks';
import { useQueryParams } from 'hooks';
import { useTimeRange } from '../../../../../hooks/useTimeRange';
import {
	convertIntoArray,
	formatDateTime,
} from '../../../../../utils/function';

const columns: ColumnsType = [
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Date & Time Created', dataIndex: 'datetime_created' },
];

interface Props {
	serverUrl: any;
}

export const TabConnectivityLogs = ({ serverUrl }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		isFetching: isConnectivityLogsFetching,
		data: { connectivityLogs, total },
		error: connectivityLogsError,
	} = useConnectivityLogs({
		params: {
			...queryParams,
			baseUrl: serverUrl,
		},
	});

	// METHODS
	useEffect(() => {
		const formattedConnectivityLogs = connectivityLogs.map(
			(connectivityLog) => ({
				key: connectivityLog.id,
				type: <ConnectivityType type={connectivityLog.type} />,
				datetime_created: formatDateTime(connectivityLog.datetime_created),
			}),
		);

		setDataSource(formattedConnectivityLogs);
	}, [connectivityLogs]);

	return (
		<>
			<TableHeader title="Connectivity Logs" />

			<Filter
				params={queryParams}
				setQueryParams={(params) => {
					setQueryParams(params, { shouldResetPage: true });
				}}
				isLoading={isConnectivityLogsFetching}
			/>

			<RequestErrors errors={convertIntoArray(connectivityLogsError)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				pagination={{
					current: Number(queryParams.page) || 1,
					total,
					pageSize: Number(queryParams.pageSize) || 10,
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
				loading={isConnectivityLogsFetching}
			/>
		</>
	);
};

interface FilterProps {
	params: any;
	isLoading: boolean;
	setQueryParams: any;
}

const Filter = ({ params, isLoading, setQueryParams }: FilterProps) => {
	const { timeRangeType, setTimeRangeType } = useTimeRange({ params });

	return (
		<Row className="mb-4" gutter={[15, 15]}>
			<Col lg={12} span={24}>
				<TimeRangeFilter
					timeRange={params.timeRange}
					timeRangeType={timeRangeType}
					setTimeRangeType={setTimeRangeType}
					setQueryParams={setQueryParams}
					disabled={isLoading}
					isRangeOnly
				/>
			</Col>
			<Col lg={12} span={24}>
				<Label label="Type" spacing />
				<Select
					style={{ width: '100%' }}
					value={params.type}
					onChange={(value) => {
						setQueryParams({ type: value });
					}}
					disabled={isLoading}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					showSearch
					allowClear
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
