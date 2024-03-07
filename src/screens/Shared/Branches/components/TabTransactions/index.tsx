import { Button, Col, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
	RequestErrors,
	RequestWarnings,
	TableHeader,
	TimeRangeFilter,
	TransactionStatus,
	ViewTransactionModal,
} from 'components';
import { BadgePill, Label } from 'components/elements';
import { filterOption } from 'ejjy-global';
import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	pageSizeOptions,
	paymentTypes,
	transactionStatuses,
} from 'global';
import { useBranchMachines, useQueryParams, useTransactions } from 'hooks';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatInPeso, getId } from 'utils';
import { TransactionsCancelled } from './components/TransactionsCancelled';

const columns: ColumnsType = [
	{ title: 'Invoice', dataIndex: 'invoice' },
	{ title: 'Amount', dataIndex: 'amount' },
	{ title: 'Status', dataIndex: 'status' },
	{ title: 'Branch Machine', dataIndex: 'branchMachine' },
];

const transactionStatusOptions = [
	{
		value: transactionStatuses.NEW,
		title: 'New',
	},
	{
		value: transactionStatuses.HOLD,
		title: 'Hold',
	},
	{
		value: transactionStatuses.VOID_EDITED,
		title: 'Void Edited',
	},
	{
		value: transactionStatuses.VOID_CANCELLED,
		title: 'Void Cancelled',
	},
	{
		value: transactionStatuses.FULLY_PAID,
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
		const data = transactions.map((branchTransaction) => {
			const {
				id,
				invoice,
				total_amount,
				payment,
				status: branchTransactionStatus,
				branch_machine,
			} = branchTransaction;

			return {
				key: id,
				invoice: (
					<Button
						className="pa-0"
						type="link"
						onClick={() => setSelectedTransaction(branchTransaction)}
					>
						{invoice?.or_number}
					</Button>
				),
				amount: formatInPeso(total_amount),
				status:
					payment.mode === paymentTypes.CREDIT ? (
						<BadgePill label="Collectible" variant="secondary" />
					) : (
						<TransactionStatus status={branchTransactionStatus} />
					),
				branchMachine: branch_machine.name,
			};
		});

		setDataSource(data);
	}, [transactions]);

	return (
		<>
			<TableHeader title="Transactions" wrapperClassName="pt-2 px-0" />

			<Filter isLoading={isFetchingTransactions} />

			<RequestErrors errors={convertIntoArray(transactionsError)} />
			<RequestWarnings warnings={convertIntoArray(warning)} />

			{[
				transactionStatuses.VOID_CANCELLED,
				transactionStatuses.VOID_EDITED,
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
	const {
		data: { branchMachines },
		isFetching: isFetchingBranchMachines,
		error: branchMachinesError,
	} = useBranchMachines({
		params: { pageSize: MAX_PAGE_SIZE },
	});

	return (
		<>
			<RequestErrors
				errors={convertIntoArray(branchMachinesError, 'Branch Machines')}
				withSpaceBottom
			/>

			<Row className="mb-4" gutter={[16, 16]}>
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

				<Col lg={12} span={24}>
					<Label label="Branch Machine" spacing />
					<Select
						className="w-100"
						defaultValue={params.branchMachineId}
						filterOption={filterOption}
						loading={isFetchingBranchMachines}
						optionFilterProp="children"
						allowClear
						showSearch
						onChange={(value) => {
							setQueryParams(
								{ branchMachineId: value },
								{ shouldResetPage: true },
							);
						}}
					>
						{branchMachines.map(({ id, name }) => (
							<Select.Option key={id} value={id}>
								{name}
							</Select.Option>
						))}
					</Select>
				</Col>

				<Col lg={12} span={24}>
					<TimeRangeFilter disabled={isLoading} />
				</Col>
			</Row>
		</>
	);
};
