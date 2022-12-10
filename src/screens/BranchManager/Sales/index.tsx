import { Col, Row, Statistic, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { Content, RequestErrors, SalesInfo, TimeRangeFilter } from 'components';
import { Box } from 'components/elements';
import { MAX_PAGE_SIZE, refetchOptions, timeRangeTypes } from 'global';
import { useBranchMachines, useQueryParams } from 'hooks';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatInPeso, getLocalBranchId } from 'utils';

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

export const Sales = () => {
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
		isFetching: isFetchingBranchMachines,
		isFetched: isBranchMachinesFetched,
		error: branchMachinesError,
	} = useBranchMachines({
		params: {
			branchId: getLocalBranchId(),
			pageSize: MAX_PAGE_SIZE,
			salesTimeRange: params.timeRange || timeRangeTypes.DAILY,
		},
		options: refetchOptions,
	});

	// METHODS
	useEffect(() => {
		const newSummary = {
			cashSales: 0,
			creditSales: 0,
			creditPayment: 0,
		};

		const data = branchMachines.map((branchMachine) => {
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
		setDataSource(data);
	}, [branchMachines]);

	return (
		<Content title="Sales">
			<SalesInfo />

			<Box padding>
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<RequestErrors
							errors={convertIntoArray(branchMachinesError)}
							withSpaceBottom
						/>

						<TimeRangeFilter />
					</Col>

					<Col span={24}>
						<div className="Summary">
							<Row gutter={[16, 16]}>
								<Col md={8}>
									<Statistic
										title="TOTAL SALES"
										value={formatInPeso(
											summary.cashSales + summary.creditSales,
										)}
									/>
								</Col>
								<Col md={8}>
									<Statistic
										title="Cash Sales"
										value={formatInPeso(summary.cashSales)}
									/>
								</Col>
								<Col md={8}>
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
								<Col md={8}>
									<Statistic
										title="TOTAL CASH ON HAND"
										value={formatInPeso(
											summary.cashSales + summary.creditPayment,
										)}
									/>
								</Col>
								<Col md={8}>
									<Statistic
										title="Cash Sales"
										value={formatInPeso(summary.cashSales)}
									/>
								</Col>
								<Col md={8}>
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
							loading={isFetchingBranchMachines && !isBranchMachinesFetched}
							pagination={false}
							scroll={{ x: 1200 }}
						/>
					</Col>
				</Row>
			</Box>
		</Content>
	);
};
