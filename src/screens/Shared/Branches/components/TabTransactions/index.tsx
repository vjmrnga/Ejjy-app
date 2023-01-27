import { Col, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	RequestErrors,
	RequestWarnings,
	TableHeader,
	TimeRangeFilter,
	TransactionStatus,
	ViewTransactionModal,
} from 'components';
import { ButtonLink, Label } from 'components/elements';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	EMPTY_CELL,
	pageSizeOptions,
	transactionStatus,
} from 'global';
import { useQueryParams, useTransactions } from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, filterOption, formatInPeso, getId } from 'utils';
import { TransactionsCancelled } from './components/TransactionsCancelled';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id', key: 'id' },
	{ title: 'Invoice', dataIndex: 'invoice', key: 'invoice' },
	{ title: 'Amount', dataIndex: 'amount', key: 'amount' },
	{ title: 'Status', dataIndex: 'status', key: 'status' },
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

interface Props {
	branch: any;
}

export const TabTransactions = ({ branch }: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);

	// CUSTOM HOOKS
	const { params, setQueryParams } = useQueryParams();
	const {
		data: { transactions, total, warning },
		isFetching: isFetchingTransactions,
		error: transactionsError,
	} = useTransactions({
		params: {
			...params,
			branchId: branch.id,
		},
	});

	// METHODS
	useEffect(() => {
		const formattedBranchTransactions = transactions.map(
			(branchTransaction) => {
				const {
					id,
					invoice,
					total_amount,
					status: branchTransactionStatus,
				} = branchTransaction;

				return {
					id: (
						<ButtonLink
							text={id}
							onClick={() => setSelectedTransaction(branchTransaction)}
						/>
					),
					invoice: invoice?.or_number || EMPTY_CELL,
					amount: formatInPeso(total_amount),
					status: <TransactionStatus status={branchTransactionStatus} />,
				};
			},
		);

		setDataSource(formattedBranchTransactions);
	}, [transactions]);

	return (
		<>
			<TableHeader title="Transactions" wrapperClassName="pt-2 px-0" />

			<Filter isLoading={isFetchingTransactions} />

			<RequestErrors errors={convertIntoArray(transactionsError)} />
			<RequestWarnings warnings={convertIntoArray(warning)} />

			{[
				transactionStatus.VOID_CANCELLED,
				transactionStatus.VOID_EDITED,
			].includes(_.toString(params?.statuses)) && (
				<TransactionsCancelled
					branchId={getId(branch)}
					statuses={_.toString(params?.statuses)}
					timeRange={_.toString(params?.timeRange)}
				/>
			)}

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={isFetchingTransactions}
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
