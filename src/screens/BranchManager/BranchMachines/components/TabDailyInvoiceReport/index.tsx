import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
	ModeOfPayment,
	RequestErrors,
	RequestWarnings,
	TableHeader,
	ViewTransactionModal,
} from '../../../../../components';
import { ButtonLink } from '../../../../../components/elements';
import { EMPTY_CELL } from '../../../../../global/constants';
import { pageSizeOptions } from '../../../../../global/options';
import { transactionStatus } from '../../../../../global/types';
import { useTransactions } from '../../../../../hooks';
import { useQueryParams } from 'hooks';
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
	{ title: 'Total Amount', dataIndex: 'totalAmount' },
	{ title: 'Cashier', dataIndex: 'cashier' },
];

interface Props {
	branchMachineId: number;
	serverUrl: any;
}

export const TabDailyInvoiceReport = ({
	branchMachineId,
	serverUrl,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
	const {
		data: { transactions, total, warning },
		isFetching,
		error,
	} = useTransactions({
		params: {
			isAdjusted: false,
			statuses: transactionStatus.FULLY_PAID,
			branchMachineId,
			serverUrl,
			timeRange: `${moment().format('MM/DD/YY')},${moment().format(
				'MM/DD/YY',
			)}`,
			...queryParams,
		},
	});

	// METHODS
	useEffect(() => {
		const data = transactions.map((transaction) => ({
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
		}));

		setDataSource(data);
	}, [transactions]);

	return (
		<>
			<TableHeader title="Daily Invoice Report" />

			<RequestErrors errors={convertIntoArray(error)} />
			<RequestWarnings warnings={convertIntoArray(warning)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 800 }}
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
					onClose={() => setSelectedTransaction(false)}
				/>
			)}
		</>
	);
};
