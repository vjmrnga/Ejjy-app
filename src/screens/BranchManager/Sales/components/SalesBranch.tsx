import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { RequestErrors } from 'components';
import { MAX_PAGE_SIZE } from 'global';
import { useBranchMachines, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatInPeso } from 'utils/function';
import { SalesTotalCard } from './SalesTotalCard';

const columns: ColumnsType = [
	{ title: 'Machine Name', dataIndex: 'machineName' },
	{ title: 'Sales', dataIndex: 'sales' },
];

export const SalesBranch = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [totalSales, setTotalSales] = useState(0);

	// CUSTOM HOOKS
	const { params } = useQueryParams();
	const {
		data: { branchMachines },
		isLoading,
		isFetching,
		isFetched,
		error,
	} = useBranchMachines({
		params: {
			pageSize: MAX_PAGE_SIZE,
			salesTimeRange: params.timeRange,
		},
		options: {
			refetchInterval: 1000,
			refetchOnMount: 'always',
		},
	});

	// METHODS
	useEffect(() => {
		let newTotalSales = 0;
		const newSales = branchMachines.map((branchMachine) => {
			newTotalSales += Number(branchMachine.sales);

			return {
				key: branchMachine.id,
				machineName: branchMachine.name,
				sales: formatInPeso(branchMachine.sales),
			};
		});

		setDataSource(newSales);
		setTotalSales(newTotalSales);
	}, [branchMachines]);

	return (
		<div className="mt-4">
			<RequestErrors errors={convertIntoArray(error)} withSpaceBottom />

			<Row gutter={[16, 16]}>
				<Col span={24}>
					<SalesTotalCard
						title="Total Sales"
						totalSales={totalSales}
						timeRange={_.toString(params.timeRange)}
						loading={isLoading}
						firstTimeLoading={!isFetched}
					/>
				</Col>

				<Col span={24}>
					<Table
						columns={columns}
						dataSource={dataSource}
						scroll={{ x: 500 }}
						pagination={false}
						loading={isLoading}
					/>
				</Col>
			</Row>
		</div>
	);
};
