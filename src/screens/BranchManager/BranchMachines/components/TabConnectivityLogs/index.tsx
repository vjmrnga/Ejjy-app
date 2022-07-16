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
	refetchOptions,
} from 'global';
import { useConnectivityLogs, useQueryParams } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, filterOption, formatDateTime } from 'utils';

const columns: ColumnsType = [
	{ title: 'Type', dataIndex: 'type' },
	{ title: 'Date & Time Created', dataIndex: 'datetime' },
];

interface Props {
	branchMachineId: any;
}

export const TabConnectivityLogs = ({ branchMachineId }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { connectivityLogs, total },
		error: connectivityLogsError,
		isFetching: isConnectivityLogsFetching,
		isFetched: isConnectivityLogsFetched,
	} = useConnectivityLogs({
		params: {
			// We explicitly set the params to prevent multiple re-rerending because of the `tab` query parameter.
			page: params?.page,
			pageSize: params?.pageSize,
			branchMachineId,
		},
		options: refetchOptions,
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
			<TableHeader wrapperClassName="pt-2 px-0" title="Connectivity Logs" />

			<Filter
				isLoading={isConnectivityLogsFetching && !isConnectivityLogsFetched}
			/>

			<RequestErrors errors={convertIntoArray(connectivityLogsError)} />

			<Table
				columns={columns}
				dataSource={dataSource}
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
				loading={isConnectivityLogsFetching && !isConnectivityLogsFetched}
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
				<TimeRangeFilter disabled={isLoading} isRangeOnly />
			</Col>
			<Col lg={12} span={24}>
				<Label label="Type" spacing />
				<Select
					className="w-100"
					value={params.type}
					onChange={(value) => {
						setQueryParams({ type: value }, { shouldResetPage: true });
					}}
					disabled={isLoading}
					optionFilterProp="children"
					filterOption={filterOption}
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
