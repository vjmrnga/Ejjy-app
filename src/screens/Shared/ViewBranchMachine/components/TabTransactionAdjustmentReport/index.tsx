import { FilePdfOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Descriptions, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	ModeOfPayment,
	RequestErrors,
	TableHeader,
	TransactionStatus,
	ViewBackOrderModal,
	ViewTransactionModal,
} from 'components';
import { ButtonLink, Label } from 'components/elements';
import { printAdjustmentReport } from 'configurePrinter';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	JSPDF_SETTINGS,
	pageSizeOptions,
	refetchOptions,
	timeRangeTypes,
	transactionStatus,
} from 'global';
import { useAuth, useQueryParams, useTransactions } from 'hooks';
import jsPDF from 'jspdf';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatDate, formatInPeso, getFullName } from 'utils';

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
}

export const TabTransactionAdjustmentReport = ({ branchMachineId }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [selectedBackOrder, setSelectedBackOrder] = useState(null);
	const [isCreatingPdf, setIsCreatingPdf] = useState(false);
	const [html, setHtml] = useState('');

	// CUSTOM HOOKS
	const { user } = useAuth();
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { transactions, total },
		error: transactionsError,
		isFetching: isFetchingTransactions,
		isFetched: isTransactionsFetched,
	} = useTransactions({
		params: {
			isAdjusted: true,
			branchMachineId,
			timeRange: timeRangeTypes.DAILY,
			...params,
		},
		options: refetchOptions,
	});

	// METHODS
	useEffect(() => {
		const data = transactions.map((transaction) => {
			const backOrder = transaction?.adjustment_remarks?.back_order;
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
					{transaction.status === transactionStatus.VOID_CANCELLED && (
						<TransactionStatus status={transaction.status} />
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
				remarks,
				totalAmount: formatInPeso(transaction.total_amount),
				cashier: getFullName(transaction.teller),
				authorizer: getFullName(transaction.void_authorizer),
			};
		});

		setDataSource(data);
	}, [transactions]);

	const handleCreatePdf = () => {
		setIsCreatingPdf(true);

		// eslint-disable-next-line new-cap
		const pdf = new jsPDF(JSPDF_SETTINGS);
		const dataHtml = printAdjustmentReport({ transactions, user });

		setHtml(dataHtml);

		pdf.html(dataHtml, {
			margin: 10,
			callback: (instance) => {
				window.open(instance.output('bloburl').toString());
				setIsCreatingPdf(false);
				setHtml('');
			},
		});
	};

	return (
		<>
			<TableHeader
				buttons={
					<Button
						disabled={dataSource.length === 0}
						icon={<FilePdfOutlined />}
						loading={isCreatingPdf}
						type="primary"
						onClick={handleCreatePdf}
					>
						Print Adjustment Report
					</Button>
				}
				title="Transaction Adjustment Report"
				wrapperClassName="pt-2 px-0"
			/>

			<Filter isLoading={isFetchingTransactions && !isTransactionsFetched} />

			<RequestErrors errors={convertIntoArray(transactionsError)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingTransactions && !isTransactionsFetched}
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
				scroll={{ x: 1200 }}
				bordered
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

			<div
				// eslint-disable-next-line react/no-danger
				dangerouslySetInnerHTML={{ __html: html }}
				style={{ display: 'none' }}
			/>
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
