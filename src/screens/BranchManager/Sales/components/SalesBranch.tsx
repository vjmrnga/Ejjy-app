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
	{ title: 'Cash Sales', dataIndex: 'cashSales' },
	{ title: 'Credit Payments', dataIndex: 'creditPayments' },
	{ title: 'Cash On Hand', dataIndex: 'cashOnHand' },
	{ title: 'Credit Sales', dataIndex: 'creditSales' },
	{ title: 'Gross Sales', dataIndex: 'grossSales' },
	{ title: 'Voided Transactions', dataIndex: 'voidedTransactions' },
	{ title: 'Discount', dataIndex: 'discount' },
	{ title: 'Net Sales', dataIndex: 'netSales', fixed: 'right' },
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
				cashSales: formatInPeso(branchMachine.sales.cash_sales),
				creditPayments: formatInPeso(branchMachine.sales.credit_payments),
				cashOnHand: formatInPeso(branchMachine.sales.cash_on_hand),
				creditSales: formatInPeso(branchMachine.sales.credit_sales),
				grossSales: formatInPeso(branchMachine.sales.gross_sales),
				voidedTransactions: formatInPeso(branchMachine.sales.voided_total),
				discount: formatInPeso(branchMachine.sales.discount),
				netSales: formatInPeso(branchMachine.sales.net_sales),
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
						scroll={{ x: 1200 }}
						pagination={false}
						loading={isLoading}
					/>
				</Col>
			</Row>
		</div>
	);
};
