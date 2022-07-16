import { Col, DatePicker, Descriptions, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	ModeOfPayment,
	RequestErrors,
	TableHeader,
	ViewBackOrderModal,
	ViewTransactionModal,
} from 'components';
import { ButtonLink, Label } from 'components/elements';
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
import { convertIntoArray, formatDate, formatInPeso, getFullName } from 'utils';

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
		isFetching: isTransactionsFetching,
		isFetched: isTransactionsFetched,
	} = useTransactions({
		params: {
			branchMachineId,
			statuses: transactionStatus.FULLY_PAID,
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
						<ButtonLink
							text={`Back Order - ${backOrder.id}`}
							onClick={() => setSelectedBackOrder(backOrder.id)}
						/>
					)}
					{previousTransaction && (
						<ButtonLink
							text={`Prev. Invoice - ${previousTransaction.invoice.or_number}`}
							onClick={() => setSelectedTransaction(previousTransaction.id)}
						/>
					)}
					{newTransaction && (
						<ButtonLink
							text={`New Invoice - ${newTransaction.invoice.or_number}`}
							onClick={() => setSelectedTransaction(newTransaction.id)}
						/>
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
				dateTime: formatDate(transaction.invoice.datetime_created),
				invoiceNumber: transaction.invoice ? (
					<ButtonLink
						text={transaction.invoice.or_number}
						onClick={() => setSelectedTransaction(transaction)}
					/>
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
			<TableHeader wrapperClassName="pt-2 px-0" title="Daily Invoice Report" />

			<Filter isLoading={isTransactionsFetching && !isTransactionsFetched} />

			<RequestErrors errors={convertIntoArray(transactionsError)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 800 }}
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
				loading={isTransactionsFetching && !isTransactionsFetched}
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
					allowClear={false}
				/>
			</Col>
		</Row>
	);
};
