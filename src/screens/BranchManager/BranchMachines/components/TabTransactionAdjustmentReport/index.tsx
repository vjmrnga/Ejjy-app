import { Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
	ModeOfPayment,
	RequestErrors,
	RequestWarnings,
	TableHeader,
	TimeRangeFilter,
	ViewBackOrderModal,
	ViewTransactionModal,
} from '../../../../../components';
import { ButtonLink } from '../../../../../components/elements';
import { EMPTY_CELL } from '../../../../../global/constants';
import { pageSizeOptions } from '../../../../../global/options';
import { timeRangeTypes } from '../../../../../global/types';
import { useTransactions } from '../../../../../hooks';
import { useQueryParams } from '../../../../../hooks/useQueryParams';
import { useTimeRange } from '../../../../../hooks/useTimeRange';
import {
	convertIntoArray,
	formatDate,
	formatInPeso,
	getFullName,
} from '../../../../../utils/function';

const columns: ColumnsType = [
	{ title: 'Date & Time', dataIndex: 'dateTime' },
	{ title: 'Invoice Number', dataIndex: 'invoiceNumber' },
	{ title: 'Invoice Type', dataIndex: 'invoiceType' },
	{ title: 'Payment', dataIndex: 'payment' },
	{ title: 'Remarks', dataIndex: 'remarks' },
	{ title: 'Total Amount', dataIndex: 'totalAmount' },
	{ title: 'Cashier', dataIndex: 'cashier' },
	{ title: 'Authorizer', dataIndex: 'authorizer' },
];

interface Props {
	branchMachineId: number;
	serverUrl: any;
}

export const TabTransactionAdjustmentReport = ({
	branchMachineId,
	serverUrl,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [selectedBackOrder, setSelectedBackOrder] = useState(null);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams({
		onParamsCheck: ({ timeRange }) => {
			const newParams = {};

			if (!_.toString(timeRange)) {
				// eslint-disable-next-line dot-notation
				newParams['timeRange'] = timeRangeTypes.DAILY;
			}

			return newParams;
		},
	});
	const {
		data: { transactions, total, warning },
		isFetching,
		error,
	} = useTransactions({
		params: {
			isAdjusted: true,
			branchMachineId,
			serverUrl,
			...queryParams,
		},
	});

	// METHODS
	useEffect(() => {
		const data = transactions.map((transaction) => {
			let remarks = null;
			if (transaction.adjustment_remarks.back_order) {
				const backOrder = transaction.adjustment_remarks.back_order;
				remarks = (
					<ButtonLink
						text={backOrder.id}
						onClick={() => setSelectedBackOrder(backOrder.id)}
					/>
				);
			} else if (transaction.adjustment_remarks.previous_voided_transaction) {
				const voidedTransaction =
					transaction.adjustment_remarks.previous_voided_transaction;
				remarks = (
					<ButtonLink
						text={voidedTransaction.invoice.or_number}
						onClick={() => setSelectedTransaction(voidedTransaction.id)}
					/>
				);
			}

			return {
				key: transaction.id,
				dateTime: formatDate(transaction.invoice.datetime_created),
				invoiceNumber: (
					<ButtonLink
						text={transaction.invoice.or_number}
						onClick={() => setSelectedTransaction(transaction)}
					/>
				),
				invoiceType: <ModeOfPayment modeOfPayment={transaction.payment.mode} />,
				payment: (
					<>
						<span>
							{transaction?.is_fully_paid ? 'Fully Paid' : 'Pending'}{' '}
						</span>
						(<ModeOfPayment modeOfPayment={transaction.payment.mode} />)
					</>
				),
				remarks: remarks,
				totalAmount: formatInPeso(transaction.total_amount),
				cashier: getFullName(transaction.teller),
				authorizer: getFullName(transaction.payment.credit_payment_authorizer),
			};
		});

		setDataSource(data);
	}, [transactions]);

	return (
		<>
			<TableHeader title="Transaction Adjustment Report" />

			<Filter
				params={queryParams}
				setQueryParams={(params) => {
					setQueryParams(params, { shouldResetPage: true });
				}}
				isLoading={isFetching}
			/>

			<RequestErrors errors={convertIntoArray(error)} />
			<RequestWarnings warnings={convertIntoArray(warning)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 1200 }}
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
				loading={isFetching}
			/>

			{selectedTransaction && (
				<ViewTransactionModal
					transaction={selectedTransaction}
					onClose={() => setSelectedTransaction(null)}
				/>
			)}

			{selectedBackOrder && (
				<ViewBackOrderModal
					backOrder={selectedBackOrder}
					onClose={() => setSelectedBackOrder(null)}
				/>
			)}
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
				/>
			</Col>
		</Row>
	);
};
