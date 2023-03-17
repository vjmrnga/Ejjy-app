import { PlusCircleFilled } from '@ant-design/icons';
import { Button, Col, Row, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	CreateOrderOfPaymentModal,
	RequestErrors,
	TableHeader,
	TimeRangeFilter,
	ViewTransactionModal,
} from 'components';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	pageSizeOptions,
	paymentTypes,
	refetchOptions,
	timeRangeTypes,
} from 'global';
import { useQueryParams, useTransactions } from 'hooks';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useUserStore } from 'stores';
import {
	convertIntoArray,
	formatDateTime,
	formatInPeso,
	getFullName,
	isCUDShown,
} from 'utils';
import { accountTabs } from '../../data';
import { AccountTotalBalance } from './components/AccountTotalBalance';

interface Props {
	disabled: boolean;
}

export const TabCreditTransactions = ({ disabled }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [selectedCreditTransaction, setSelectedCreditTransaction] =
		useState(null);
	const [
		isCreateOrderOfPaymentModalVisible,
		setIsCreateOrderOfPaymentModalVisible,
	] = useState(false);
	const [payor, setPayor] = useState(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const user = useUserStore((state) => state.user);
	const {
		data: { transactions, total },
		isFetching: isFetchingTransactions,
		isFetched: isTransactionsFetched,
		error: transactionsError,
	} = useTransactions({
		params: {
			modeOfPayment: paymentTypes.CREDIT,
			payorCreditorAccountId: payor?.account?.id,
			timeRange: params?.timeRange || timeRangeTypes.DAILY,
			...params,
		},
		options: refetchOptions,
	});

	// METHODS

	useEffect(() => {
		const data = transactions.map((transaction) => {
			const { id, invoice, total_amount, teller, datetime_created, payment } =
				transaction;

			return {
				key: id,
				datetime: formatDateTime(datetime_created),
				clientCode: payment?.creditor_account?.account_code,
				invoiceNumber: (
					<Button
						className="pa-0"
						type="link"
						onClick={() => setSelectedTransaction(transaction)}
					>
						{invoice.or_number}
					</Button>
				),
				amount: formatInPeso(total_amount),
				cashier: getFullName(teller),
				authorizer: getFullName(transaction.payment.credit_payment_authorizer),
				actions: (
					<Tooltip title="Create Order of Payment">
						<Button
							disabled={disabled}
							icon={<PlusCircleFilled />}
							type="primary"
							ghost
							onClick={() => setSelectedCreditTransaction(transaction)}
						/>
					</Tooltip>
				),
			};
		});

		setDataSource(data);
	}, [transactions, payor, disabled]);

	useEffect(() => {
		if (params.payor) {
			setPayor(JSON.parse(_.toString(params.payor)));
		}
	}, [params.payor]);

	const getColumns = useCallback(() => {
		const columns: ColumnsType = [
			{ title: 'Date & Time', dataIndex: 'datetime' },
			{ title: 'Client Code', dataIndex: 'clientCode' },
			{ title: 'Invoice Number', dataIndex: 'invoiceNumber' },
			{ title: 'Amount', dataIndex: 'amount' },
			{ title: 'Cashier', dataIndex: 'cashier' },
			{ title: 'Authorizer', dataIndex: 'authorizer' },
		];

		if (payor && isCUDShown(user.user_type)) {
			columns.push({
				title: 'Actions',
				dataIndex: 'actions',
				width: 150,
				fixed: 'right',
			});
		}

		return columns;
	}, [payor]);

	const handleCreateOrderOfPaymentsSuccess = () => {
		setQueryParams(
			{ tab: accountTabs.ORDER_OF_PAYMENTS },
			{ shouldResetPage: true, shouldIncludeCurrentParams: false },
		);
	};

	return (
		<div>
			<TableHeader title="Credit Transactions" wrapperClassName="pt-2 px-0" />

			{payor && (
				<AccountTotalBalance
					account={payor.account}
					disabled={disabled}
					totalBalance={payor.total_balance}
					onClick={() => setIsCreateOrderOfPaymentModalVisible(true)}
				/>
			)}

			<RequestErrors
				errors={convertIntoArray(transactionsError)}
				withSpaceBottom
			/>

			<Filter isLoading={isFetchingTransactions && !isTransactionsFetched} />

			<Table
				columns={getColumns()}
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
				scroll={{ x: 1000 }}
				bordered
			/>

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
					onClose={() => {
						setSelectedCreditTransaction(null);
						setIsCreateOrderOfPaymentModalVisible(false);
					}}
					onSuccess={handleCreateOrderOfPaymentsSuccess}
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
