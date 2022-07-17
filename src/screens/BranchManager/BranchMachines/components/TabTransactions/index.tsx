import { Col, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	RequestErrors,
	TableHeader,
	TimeRangeFilter,
	TransactionStatus,
	ViewTransactionModal,
} from 'components';
import { BadgePill, ButtonLink, Label } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
	paymentTypes,
	refetchOptions,
	timeRangeTypes,
	transactionStatus,
} from 'global';
import { useQueryParams, useTransactions } from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { TransactionsCancelled } from 'screens/Shared/Branches/components/TabTransactions/components/TransactionsCancelled';
import { convertIntoArray, filterOption, formatInPeso } from 'utils';
import { Summary } from './components/Summary';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id' },
	{ title: 'Invoice', dataIndex: 'invoice' },
	{ title: 'Amount', dataIndex: 'amount' },
	{ title: 'Status', dataIndex: 'status' },
];

const transactionStatusOptions = [
	{
		value: transactionStatus.NEW,
		title: 'New',
	},
	{
		value: transactionStatus.HOLD,
		title: 'Hold',
	},
	{
		value: transactionStatus.VOID_EDITED,
		title: 'Void Edited',
	},
	{
		value: transactionStatus.VOID_CANCELLED,
		title: 'Void Cancelled',
	},
	{
		value: transactionStatus.FULLY_PAID,
		title: 'Fully Paid',
	},
];

const voidedStatuses = [
	transactionStatus.VOID_CANCELLED,
	transactionStatus.VOID_EDITED,
];

interface Props {
	branchMachineId: number;
}

export const TabTransactions = ({ branchMachineId }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { transactions, total },
		error: transactionsError,
		isFetching: isTransactionsFetching,
		isFetched: isTransactionsFetched,
	} = useTransactions({
		params: {
			...params,
			branchMachineId,
			timeRange: params?.timeRange || timeRangeTypes.DAILY,
		},
		options: refetchOptions,
	});

	// METHODS
	useEffect(() => {
		const data = transactions.map((transaction) => {
			const { id, invoice, total_amount, status, payment } = transaction;

			return {
				key: id,
				id: (
					<ButtonLink
						text={id}
						onClick={() => setSelectedTransaction(transaction)}
					/>
				),
				invoice: invoice?.or_number || EMPTY_CELL,
				amount: formatInPeso(total_amount),
				status:
					payment.mode === paymentTypes.CREDIT ? (
						<BadgePill label="Pending" variant="secondary" />
					) : (
						<TransactionStatus status={status} />
					),
			};
		});

		setDataSource(data);
	}, [transactions]);

	return (
		<>
			<TableHeader title="Transactions" wrapperClassName="pt-2 px-0" />

			<Filter isLoading={isTransactionsFetching && !isTransactionsFetched} />

			<RequestErrors errors={convertIntoArray(transactionsError)} />

			{voidedStatuses.includes(_.toString(params?.statuses)) && (
				<TransactionsCancelled
					statuses={_.toString(params?.statuses)}
					timeRange={_.toString(params?.timeRange)}
				/>
			)}

			<Summary branchMachineId={branchMachineId} />

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isTransactionsFetching && !isTransactionsFetched}
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

interface FilterProps {
	isLoading: boolean;
}

const Filter = ({ isLoading }: FilterProps) => {
	const { params, setQueryParams } = useQueryParams();

	return (
		<Row className="mb-4" gutter={[16, 16]}>
			<Col lg={12} span={24}>
				<TimeRangeFilter disabled={isLoading} />
			</Col>
			<Col lg={12} span={24}>
				<Label label="Status" spacing />
				<Select
					className="w-100"
					disabled={isLoading}
					filterOption={filterOption}
					optionFilterProp="children"
					value={params.statuses}
					allowClear
					showSearch
					onChange={(value) => {
						setQueryParams({ statuses: value }, { shouldResetPage: true });
					}}
				>
					{transactionStatusOptions.map((option) => (
						<Select.Option key={option.value} value={option.value}>
							{option.title}
						</Select.Option>
					))}
				</Select>
			</Col>
		</Row>
	);
};
