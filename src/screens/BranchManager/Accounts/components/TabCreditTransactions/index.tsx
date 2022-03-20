import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	CreateOrderOfPaymentModal,
	RequestErrors,
	TableActions,
	TableHeader,
	TimeRangeFilter,
	ViewAccountModal,
	ViewTransactionModal,
} from 'components';
import {
	EMPTY_CELL,
	pageSizeOptions,
	paymentTypes,
	timeRangeTypes,
} from 'global';
import { useQueryParams, useTransactions } from 'hooks';
import { useTimeRange } from 'hooks/useTimeRange';
import _, { toString } from 'lodash';
import React, { useEffect, useState } from 'react';
import { AccountTotalBalance } from 'screens/BranchManager/Accounts/components/TabCreditTransactions/components/AccountTotalBalance';
import { accountTabs } from 'screens/BranchManager/Accounts/data';
import {
	convertIntoArray,
	formatDateTime,
	formatInPeso,
	getFullName,
} from 'utils/function';
import '../../style.scss';

const columns: ColumnsType = [
	{ title: 'Date & Time', dataIndex: 'datetime' },
	{ title: 'Client Code', dataIndex: 'clientCode' },
	{ title: 'Invoice Number', dataIndex: 'invoiceNumber' },
	{ title: 'Amount', dataIndex: 'amount' },
	{ title: 'Cashier', dataIndex: 'cashier' },
	{ title: 'Authorizer', dataIndex: 'authorizer' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const TabCreditTransactions = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [selectedAccount, setSelectedAccount] = useState(null);
	const [selectedCreditTransaction, setSelectedCreditTransaction] =
		useState(null);
	const [payor, setPayor] = useState(null);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams({
		onParamsCheck: ({ timeRange }) => {
			const newParams = {};

			if (!toString(timeRange)) {
				// eslint-disable-next-line dot-notation
				newParams['timeRange'] = timeRangeTypes.DAILY;
			}

			return newParams;
		},
	});
	const {
		data: { transactions, total },
		isFetching,
		error,
	} = useTransactions({
		params: {
			modeOfPayment: paymentTypes.CREDIT,
			payorCreditorAccountId: payor?.account?.id,
			...queryParams,
		},
	});

	// METHODS
	useEffect(() => {
		const formattedTransactions = transactions.map((transaction) => {
			const { id, invoice, total_amount, employee_id, datetime_created } =
				transaction;

			return {
				key: id,
				datetime: formatDateTime(datetime_created),
				clientCode: EMPTY_CELL, // TODO: set correct value
				invoiceNumber: (
					<Button
						type="link"
						onClick={() => setSelectedTransaction(transaction)}
					>
						{invoice.or_number}
					</Button>
				),
				amount: formatInPeso(total_amount),
				cashier: employee_id,
				authorizer: getFullName(transaction.payment.credit_payment_authorizer),
				actions: (
					<TableActions
						onAdd={() => setSelectedCreditTransaction(transaction)}
						onAddName="Create Order of Payment"
					/>
				),
			};
		});

		setDataSource(formattedTransactions);
	}, [transactions]);

	useEffect(() => {
		if (queryParams.payor) {
			setPayor(JSON.parse(_.toString(queryParams.payor)));
		}
	}, [queryParams.payor]);

	const onCreateOrderOfPaymentsSuccess = () => {
		setQueryParams(
			{ tab: accountTabs.ORDER_OF_PAYMENTS },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<div>
			<TableHeader title="Credit Transactions" />

			{payor && (
				<AccountTotalBalance
					account={payor.account}
					total_balance={payor.total_balance}
				/>
			)}

			<Filter
				params={queryParams}
				setQueryParams={(params) => {
					setQueryParams(params, { shouldResetPage: true });
				}}
				isLoading={isFetching}
			/>

			<RequestErrors errors={convertIntoArray(error)} />

			<Table
				columns={columns}
				dataSource={dataSource}
				scroll={{ x: 1000 }}
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

			{selectedAccount && (
				<ViewAccountModal
					account={selectedAccount}
					onClose={() => setSelectedAccount(null)}
				/>
			)}

			{selectedTransaction && (
				<ViewTransactionModal
					transaction={selectedTransaction}
					onClose={() => setSelectedTransaction(null)}
				/>
			)}

			{selectedCreditTransaction && (
				<CreateOrderOfPaymentModal
					transaction={selectedCreditTransaction}
					onSuccess={onCreateOrderOfPaymentsSuccess}
					onClose={() => setSelectedCreditTransaction(null)}
				/>
			)}
		</div>
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
