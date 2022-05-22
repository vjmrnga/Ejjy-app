import { Col, DatePicker, Descriptions, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	ModeOfPayment,
	RequestErrors,
	RequestWarnings,
	TableHeader,
	ViewBackOrderModal,
	ViewTransactionModal,
} from 'components';
import { ButtonLink, Label } from 'components/elements';
import { pageSizeOptions, timeRangeTypes } from 'global';
import { useQueryParams, useTransactions } from 'hooks';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
	convertIntoArray,
	formatDate,
	formatInPeso,
	getFullName,
} from 'utils/function';

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

export const TabTransactionAdjustmentReport = ({ branchMachineId }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [selectedBackOrder, setSelectedBackOrder] = useState(null);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		data: { transactions, total, warning },
		isFetching,
		error,
	} = useTransactions({
		params: {
			isAdjusted: true,
			branchMachineId,
			timeRange: timeRangeTypes.DAILY,
			...queryParams,
		},
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
				authorizer: getFullName(transaction.void_authorizer),
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

const Filter = ({ params, isLoading, setQueryParams }: FilterProps) => (
	<Row className="mb-4" gutter={[16, 16]}>
		<Col lg={12} span={24}>
			<Label label="Date" spacing />
			<DatePicker
				disabled={isLoading}
				format="MM/DD/YY"
				value={
					_.toString(params.timeRange).split(',')?.length === 2
						? moment(_.toString(params.timeRange).split(',')[0])
						: null
				}
				onChange={(date, dateString) => {
					setQueryParams({ timeRange: [dateString, dateString].join(',') });
				}}
			/>
		</Col>
	</Row>
);
