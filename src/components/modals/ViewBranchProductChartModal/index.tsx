import { Button, Modal, Spin, Tabs } from 'antd';
import { RequestErrors } from 'components/RequestErrors';
import { TimeRangeFilter } from 'components/TimeRangeFilter/TimeRangeFilter';
import {
	MAX_PAGE_SIZE,
	serviceTypes,
	timeRangeTypes,
	userLogTypes,
} from 'global';
import { useUserLogs } from 'hooks';
import React, { useEffect, useState } from 'react';
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import { convertIntoArray, formatDateTime, isStandAlone } from 'utils';

const tabs = {
	PRICE_PER_PIECE: 'price_per_piece',
	PRICE_PER_BULK: 'price_per_bulk',
	COST_PER_PIECE: 'cost_per_piece',
	COST_PER_BULK: 'cost_per_bulk',
};

interface Props {
	product?: any;
	branchProduct?: any;
	onClose: any;
}

export const ViewBranchProductChartModal = ({
	product,
	branchProduct,
	onClose,
}: Props) => {
	// STATES
	const [tab, setTab] = useState(tabs.PRICE_PER_PIECE);
	const [timeRange, setTimeRange] = useState(null);

	// CUSTOM HOOKS
	const {
		data: { logs },
		isFetching: isFetchingLogs,
		error: logsError,
	} = useUserLogs({
		params: {
			branchProductId: branchProduct?.id,
			productId: product?.id,
			pageSize: MAX_PAGE_SIZE,
			serviceType: isStandAlone() ? serviceTypes.NORMAL : serviceTypes.OFFLINE,
			timeRange,
			type: branchProduct?.id
				? userLogTypes.BRANCH_PRODUCTS
				: userLogTypes.PRODUCTS,
		},
		options: {
			enabled: !!branchProduct || !!product,
		},
	});

	return (
		<Modal
			className="Modal__hasFooter Modal__large"
			footer={<Button onClick={onClose}>Close</Button>}
			title={
				<>
					<span>Product Trend</span>
					<span className="ModalTitleMainInfo">
						{product?.name || branchProduct?.product?.name}
					</span>
				</>
			}
			centered
			closable
			visible
			onCancel={onClose}
		>
			<Spin spinning={isFetchingLogs}>
				<TimeRangeFilter
					fields={[timeRangeTypes.MONTHLY, timeRangeTypes.DATE_RANGE]}
					onChange={setTimeRange}
				/>
				<RequestErrors
					errors={convertIntoArray(logsError, 'Logs')}
					withSpaceBottom
				/>

				<Tabs
					activeKey={tab}
					className="mt-6"
					type="card"
					destroyInactiveTabPane
					onTabClick={setTab}
				>
					<Tabs.TabPane key={tabs.PRICE_PER_PIECE} tab="Regular Price (Piece)">
						<Chart dataKey={tabs.PRICE_PER_PIECE} logs={logs} />
					</Tabs.TabPane>

					<Tabs.TabPane key={tabs.PRICE_PER_BULK} tab="Regular Price (Bulk)">
						<Chart dataKey={tabs.PRICE_PER_BULK} logs={logs} />
					</Tabs.TabPane>

					<Tabs.TabPane key={tabs.COST_PER_PIECE} tab="Cost (Piece)">
						<Chart dataKey={tabs.COST_PER_PIECE} logs={logs} />
					</Tabs.TabPane>

					<Tabs.TabPane key={tabs.COST_PER_BULK} tab="Cost (Bulk)">
						<Chart dataKey={tabs.COST_PER_BULK} logs={logs} />
					</Tabs.TabPane>
				</Tabs>
			</Spin>
		</Modal>
	);
};

const Chart = ({ dataKey, logs }) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);

	// METHODS
	useEffect(() => {
		const data = [];
		logs.reverse().forEach((log) => {
			let dataChanges = log?.product_metadata?.data_changes;

			if (dataChanges) {
				dataChanges = JSON.parse(log?.product_metadata?.data_changes);

				if (dataKey in dataChanges) {
					data.push({
						name: formatDateTime(log.datetime_created),
						amount: dataChanges[dataKey],
					});
				}
			}
		});

		setDataSource(data);
	}, [dataKey, logs]);

	return (
		<div style={{ width: '100%', height: '400px' }}>
			<ResponsiveContainer height="100%" width="100%">
				<LineChart
					data={dataSource}
					height={300}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Line dataKey="amount" stroke="#82ca9d" type="monotone" />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};
