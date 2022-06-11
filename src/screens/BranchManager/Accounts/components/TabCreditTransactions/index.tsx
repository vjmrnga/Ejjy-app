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
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
	paymentTypes,
} from 'global';
import { useQueryParams, useTransactions } from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { AccountTotalBalance } from 'screens/BranchManager/Accounts/components/TabCreditTransactions/components/AccountTotalBalance';
import { accountTabs } from 'screens/BranchManager/Accounts/data';
import {
	convertIntoArray,
	formatDateTime,
	formatInPeso,
	getFullName,
} from 'utils';
import '../../style.scss';

export const TabCreditTransactions = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [selectedAccount, setSelectedAccount] = useState(null);
	const [selectedCreditTransaction, setSelectedCreditTransaction] =
		useState(null);
	const [
		isCreateOrderOfPaymentModalVisible,
		setIsCreateOrderOfPaymentModalVisible,
	] = useState(false);
	const [payor, setPayor] = useState(null);

	// CUSTOM HOOKS
	const { params: queryParams, setQueryParams } = useQueryParams();
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
			const {
				id,
				invoice,
				total_amount,
				employee_id,
				datetime_created,
				payment,
			} = transaction;

			return {
				key: id,
				datetime: formatDateTime(datetime_created),
				clientCode: payment?.creditor_account?.account_code,
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
	}, [transactions, payor]);

	useEffect(() => {
		if (queryParams.payor) {
			setPayor(JSON.parse(_.toString(queryParams.payor)));
		}
	}, [queryParams.payor]);

	const getColumns = useCallback(() => {
		const columns: ColumnsType = [
			{ title: 'Date & Time', dataIndex: 'datetime' },
			{ title: 'Client Code', dataIndex: 'clientCode' },
			{ title: 'Invoice Number', dataIndex: 'invoiceNumber' },
			{ title: 'Amount', dataIndex: 'amount' },
			{ title: 'Cashier', dataIndex: 'cashier' },
			{ title: 'Authorizer', dataIndex: 'authorizer' },
		];

		if (payor) {
			columns.push({
				title: 'Actions',
				dataIndex: 'actions',
				width: 150,
				fixed: 'right',
			});
		}

		return columns;
	}, [payor]);

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
					totalBalance={payor.total_balance}
					onClick={() => setIsCreateOrderOfPaymentModalVisible(true)}
				/>
			)}

			<Filter isLoading={isFetching} />

			<RequestErrors errors={convertIntoArray(error)} />

			<Table
				columns={getColumns()}
				dataSource={dataSource}
				scroll={{ x: 1000 }}
				pagination={{
					current: Number(queryParams.page) || DEFAULT_PAGE,
					total,
					pageSize: Number(queryParams.pageSize) || DEFAULT_PAGE_SIZE,
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

			{(selectedCreditTransaction || isCreateOrderOfPaymentModalVisible) && (
				<CreateOrderOfPaymentModal
					payor={payor}
					transaction={selectedCreditTransaction}
					onSuccess={onCreateOrderOfPaymentsSuccess}
					onClose={() => {
						setSelectedCreditTransaction(null);
						setIsCreateOrderOfPaymentModalVisible(false);
					}}
				/>
			)}
		</div>
	);
};

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => (
	<Row className="mb-4" gutter={[16, 16]}>
		<Col lg={12} span={24}>
			<TimeRangeFilter disabled={isLoading} />
		</Col>
	</Row>
);
