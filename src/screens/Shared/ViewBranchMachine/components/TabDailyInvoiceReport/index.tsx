import { Button, Col, DatePicker, Descriptions, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	ModeOfPayment,
	RequestErrors,
	TableHeader,
	ViewBackOrderModal,
	ViewTransactionModal,
} from 'components';
import { Label } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
	refetchOptions,
	timeRangeTypes,
	transactionStatus,
} from 'global';
import { useQueryParams, useTransactions } from 'hooks';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatDateTime,
	formatInPeso,
	getFullName,
} from 'utils';

const columns: ColumnsType = [
	{ title: 'Date & Time', dataIndex: 'dateTime' },
	{ title: 'Invoice Number', dataIndex: 'invoiceNumber' },
	{ title: 'Invoice Type', dataIndex: 'invoiceType' },
	{ title: 'Total Amount', dataIndex: 'totalAmount' },
	{ title: 'Cashier', dataIndex: 'cashier' },
	{ title: 'Remarks', dataIndex: 'remarks' },
];

interface Props {
	branchMachineId: number;
}

export const TabDailyInvoiceReport = ({ branchMachineId }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [selectedBackOrder, setSelectedBackOrder] = useState(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { transactions, total },
		error: transactionsError,
		isFetching: isFetchingTransactions,
		isFetchedAfterMount: isTransactionsFetchedAfterMount,
	} = useTransactions({
		params: {
			branchMachineId,
			statuses: [
				transactionStatus.FULLY_PAID,
				transactionStatus.VOID_EDITED,
			].join(','),
			timeRange: timeRangeTypes.DAILY,
			...params,
		},
		options: refetchOptions,
	});

	// METHODS
	useEffect(() => {
		const data = transactions.map((transaction) => {
			const backOrder = transaction?.adjustment_remarks?.back_order;
			const previousTransaction =
				transaction?.adjustment_remarks?.previous_voided_transaction;
			const newTransaction =
				transaction?.adjustment_remarks?.new_updated_transaction;
			const discountOption = transaction?.adjustment_remarks?.discount_option;

			const remarks = (
				<Space direction="vertical">
					{backOrder && (
						<Button
							type="link"
							onClick={() => setSelectedBackOrder(backOrder.id)}
						>
							Back Order - {backOrder.id}
						</Button>
					)}
					{previousTransaction && (
						<Button
							type="link"
							onClick={() => setSelectedTransaction(previousTransaction.id)}
						>
							Prev. Invoice - {previousTransaction.invoice.or_number}
						</Button>
					)}
					{newTransaction && (
						<Button
							type="link"
							onClick={() => setSelectedTransaction(newTransaction.id)}
						>
							New Invoice - {newTransaction.invoice.or_number}
						</Button>
					)}
					{discountOption && (
						<Descriptions column={1} size="small" bordered>
							<Descriptions.Item label="Name">
								{discountOption.name}
							</Descriptions.Item>
							<Descriptions.Item label="Type">
								{_.upperFirst(discountOption.type)}{' '}
								{discountOption.percentage > 0
									? `${discountOption.percentage}%`
									: ''}
							</Descriptions.Item>
							<Descriptions.Item label="Amount">
								{formatInPeso(transaction.overall_discount)}
							</Descriptions.Item>
						</Descriptions>
					)}
				</Space>
			);

			return {
				key: transaction.id,
				dateTime: formatDateTime(transaction.invoice.datetime_created),
				invoiceNumber: transaction.invoice ? (
					<Button
						type="link"
						onClick={() => setSelectedTransaction(transaction)}
					>
						{transaction.invoice.or_number}
					</Button>
				) : (
					EMPTY_CELL
				),
				invoiceType: <ModeOfPayment modeOfPayment={transaction.payment.mode} />,
				totalAmount: formatInPeso(transaction.total_amount),
				cashier: getFullName(transaction.teller),
				remarks,
			};
		});

		setDataSource(data);
	}, [transactions]);

	return (
		<>
			<TableHeader title="Daily Invoice Report" wrapperClassName="pt-2 px-0" />

			<Filter
				isLoading={isFetchingTransactions && !isTransactionsFetchedAfterMount}
			/>

			<RequestErrors errors={convertIntoArray(transactionsError)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingTransactions && !isTransactionsFetchedAfterMount}
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
				scroll={{ x: 800 }}
				bordered
			/>

			{selectedTransaction && (
				<ViewTransactionModal
					transaction={selectedTransaction}
					onClose={() => setSelectedTransaction(false)}
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
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => {
	const { params, setQueryParams } = useQueryParams();

	return (
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<Label label="Date" spacing />
				<DatePicker
					allowClear={false}
					disabled={isLoading}
					format="MM/DD/YY"
					value={
						_.toString(params.timeRange).split(',')?.length === 2
							? moment(_.toString(params.timeRange).split(',')[0])
							: moment()
					}
					onChange={(date, dateString) => {
						setQueryParams(
							{ timeRange: [dateString, dateString].join(',') },
							{ shouldResetPage: true },
						);
					}}
				/>
			</Col>
		</Row>
	);
};
