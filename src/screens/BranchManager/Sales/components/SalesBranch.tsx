import { Col, Row, Statistic, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { RequestErrors } from 'components';
import { MAX_PAGE_SIZE } from 'global';
import { useBranchMachines, useQueryParams } from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatInPeso } from 'utils';
import '../style.scss';

const columns: ColumnsType = [
	{ title: 'Machine Name', dataIndex: 'machineName' },
	{ title: 'Credit Payments', dataIndex: 'creditPayments' },
	{ title: 'Cash In', dataIndex: 'cashIn' },
	{ title: 'Cash Out', dataIndex: 'cashOut' },
	{ title: 'Cash Sales', dataIndex: 'cashSales' },
	{ title: 'Cash On Hand', dataIndex: 'cashOnHand' },
	{ title: 'Credit Sales', dataIndex: 'creditSales' },
	{ title: 'Gross Sales', dataIndex: 'grossSales' },
	{ title: 'Voided Transactions', dataIndex: 'voidedTransactions' },
	{ title: 'Discount', dataIndex: 'discount' },
	{ title: 'Net Sales', dataIndex: 'netSales', fixed: 'right' },
];

const BRANCH_MACHINES_INTERVAL_MS = 5000;

export const SalesBranch = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [summary, setSummary] = useState({
		cashSales: 0,
		creditSales: 0,
		creditPayment: 0,
	});

	// CUSTOM HOOKS
	const { params } = useQueryParams();
	const {
		data: { branchMachines },
		isLoading,
		error,
	} = useBranchMachines({
		params: {
			pageSize: MAX_PAGE_SIZE,
			salesTimeRange: params.timeRange,
		},
		options: {
			refetchInterval: BRANCH_MACHINES_INTERVAL_MS,
			refetchOnMount: 'always',
		},
	});

	// METHODS
	useEffect(() => {
		const newSummary = {
			cashSales: 0,
			creditSales: 0,
			creditPayment: 0,
		};

		const newSales = branchMachines.map((branchMachine) => {
			newSummary.cashSales += Number(branchMachine.sales.cash_sales);
			newSummary.creditSales += Number(branchMachine.sales.credit_sales);
			newSummary.creditPayment += Number(branchMachine.sales.credit_payments);

			return {
				key: branchMachine.id,
				machineName: branchMachine.name,
				creditPayments: formatInPeso(branchMachine.sales.credit_payments),
				cashIn: formatInPeso(branchMachine.sales.cash_in),
				cashOut: formatInPeso(branchMachine.sales.cash_out),
				cashSales: formatInPeso(branchMachine.sales.cash_sales),
				cashOnHand: formatInPeso(branchMachine.sales.cash_on_hand),
				creditSales: formatInPeso(branchMachine.sales.credit_sales),
				grossSales: formatInPeso(branchMachine.sales.gross_sales),
				voidedTransactions: formatInPeso(branchMachine.sales.voided_total),
				discount: formatInPeso(branchMachine.sales.discount),
				netSales: formatInPeso(branchMachine.sales.net_sales),
			};
		});

		setSummary(newSummary);
		setDataSource(newSales);
	}, [branchMachines]);

	return (
		<div className="mt-4">
			<RequestErrors errors={convertIntoArray(error)} withSpaceBottom />

			<Row gutter={[16, 16]}>
				<Col span={24}>
					<div className="Summary">
						<Row gutter={[16, 16]}>
							<Col xs={24} sm={8} md={8}>
								<Statistic
									title="TOTAL SALES"
									value={formatInPeso(summary.cashSales + summary.creditSales)}
								/>
							</Col>
							<Col xs={24} sm={8} md={8}>
								<Statistic
									title="Cash Sales"
									value={formatInPeso(summary.cashSales)}
								/>
							</Col>
							<Col xs={24} sm={8} md={8}>
								<Statistic
									title="Credit Sales"
									value={formatInPeso(summary.creditSales)}
								/>
							</Col>
						</Row>
					</div>
				</Col>

				<Col span={24}>
					<div className="Summary">
						<Row gutter={[16, 16]}>
							<Col xs={24} sm={8} md={8}>
								<Statistic
									title="TOTAL CASH ON HAND"
									value={formatInPeso(
										summary.cashSales + summary.creditPayment,
									)}
								/>
							</Col>
							<Col xs={24} sm={8} md={8}>
								<Statistic
									title="Cash Sales"
									value={formatInPeso(summary.cashSales)}
								/>
							</Col>
							<Col xs={24} sm={8} md={8}>
								<Statistic
									title="Credit Payment"
									value={formatInPeso(summary.creditPayment)}
								/>
							</Col>
						</Row>
					</div>
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
