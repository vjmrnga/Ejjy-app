import { Col, Divider, Row, Select, Table, Tag } from 'antd';
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
	MAX_PAGE_SIZE,
	NOTIFICATION_INTERVAL_MS,
	pageSizeOptions,
	timeRangeTypes,
} from 'global';
import { useBranches, useConnectivityLogs, useQueryParams } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, filterOption, formatDateTime } from 'utils';

export const TabBranchConnectivityLogs = () => {
	return (
		<>
			<ConnectivityStatusesTable />

			<Divider />

			<ConnectivityLogsTable />
		</>
	);
};

const ConnectivityStatusesTable = () => {
	// VARIABLES
	const columns: ColumnsType = [
		{ title: 'Branch', dataIndex: 'branch' },
		{ title: 'Connectivity Status', dataIndex: 'connectivityStatus' },
	];

	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const {
		data: { branches },
		isLoading: isFetchingBranches,
		error: branchesErrors,
	} = useBranches({
		params: { pageSize: MAX_PAGE_SIZE },
		options: { refetchInterval: NOTIFICATION_INTERVAL_MS },
	});

	// METHODS
	useEffect(() => {
		const data = branches.map((branch) => ({
			key: branch.id,
			branch: branch?.name,
			connectivityStatus: branch.is_online ? (
				<Tag color="green">Online</Tag>
			) : (
				<Tag color="red">Offline</Tag>
			),
		}));

		setDataSource(data);
	}, [branches]);

	return (
		<>
			<TableHeader
				title="Branch Connectivity Status"
				wrapperClassName="pt-2 px-0"
			/>

			<RequestErrors errors={convertIntoArray(branchesErrors)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingBranches}
				pagination={false}
				bordered
			/>
		</>
	);
};

const ConnectivityLogsTable = () => {
	// VARIABLES
	const columns: ColumnsType = [
		{ title: 'Branch', dataIndex: 'branch' },
		{ title: 'Type', dataIndex: 'type' },
		{ title: 'Date & Time Created', dataIndex: 'datetime' },
	];

	// STATES
	const [dataSource, setDataSource] = useState([]);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { connectivityLogs, total },
		isFetching: isFetchingConnectivityLogs,
		error: connectivityLogsError,
	} = useConnectivityLogs({ params });

	// METHODS
	useEffect(() => {
		const data = connectivityLogs.map((connectivityLog) => ({
			key: connectivityLog.id,
			branch: connectivityLog.branch?.name,
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
	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { branches },
		isFetching: isFetchingBranches,
		error: branchErrors,
	} = useBranches({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	return (
		<div>
			<RequestErrors
				errors={convertIntoArray(branchErrors, 'Branches')}
				withSpaceBottom
			/>

			<Row className="mb-4" gutter={[16, 16]}>
				<Col lg={12} span={24}>
					<Label label="Branch" spacing />
					<Select
						className="w-100"
						filterOption={filterOption}
						loading={isFetchingBranches}
						optionFilterProp="children"
						value={params.branchId ? Number(params.branchId) : null}
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams({ branchId: value }, { shouldResetPage: true });
						}}
					>
						{branches.map((branch) => (
							<Select.Option key={branch.id} value={branch.id}>
								{branch.name}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col lg={12} span={24}>
					<Label label="Type" spacing />
					<Select
						className="w-100"
						disabled={isLoading || isFetchingBranches}
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

				<Col lg={12} span={24}>
					<TimeRangeFilter
						disabled={isLoading || isFetchingBranches}
						fields={[timeRangeTypes.DATE_RANGE]}
					/>
				</Col>
			</Row>
		</div>
	);
};
