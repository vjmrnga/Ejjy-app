import { Col, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import {
	RequestErrors,
	RequestWarnings,
	TableHeader,
} from '../../../../components';
import { ButtonLink, Label } from '../../../../components/elements';
import { EMPTY_CELL } from '../../../../global/constants';
import { pageSizeOptions } from '../../../../global/options';
import { request, transactionStatus } from '../../../../global/types';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { useTransactions } from '../../../../hooks/useTransactions';
import {
	convertIntoArray,
	getTransactionStatus,
	numberWithCommas,
} from '../../../../utils/function';
import { ViewTransactionModal } from './BranchTransactions/ViewTransactionModal';

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
	branchId: any;
}

export const ViewBranchTransactions = ({ branchId }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);

	// CUSTOM HOOKS
	const {
		transactions,
		pageCount,
		currentPage,
		pageSize,

		listTransactions,
		status,
		errors,
		warnings,
	} = useTransactions();

	const { params: queryParams, setQueryParams } = useQueryParams({
		page: currentPage,
		pageSize,
		onQueryParamChange: (params) => {
			listTransactions(
				{
					...params,
					branchId,
				},
				true,
			);
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
					amount: `₱${numberWithCommas(total_amount?.toFixed(2))}`,
					status: getTransactionStatus(branchTransactionStatus),
				};
			},
		);

		setData(formattedBranchTransactions);
	}, [transactions]);

	return (
		<>
			<TableHeader title="Transactions" />

			<Filter
				params={queryParams}
				setQueryParams={(params) => {
					setQueryParams(params, { shouldResetPage: true });
				}}
			/>

			<RequestErrors errors={convertIntoArray(errors)} />
			<RequestWarnings warnings={convertIntoArray(warnings)} />

			<Table
				columns={columns}
				dataSource={data}
				scroll={{ x: 800 }}
				pagination={{
					current: currentPage,
					total: pageCount,
					pageSize,
					onChange: (page, newPageSize) => {
						setQueryParams({
							page,
							pageSize: newPageSize,
						});
					},
					disabled: !data,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				loading={status === request.REQUESTING}
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
	params: any;
	setQueryParams: any;
}

const Filter = ({ params, setQueryParams }: FilterProps) => (
	<Row className="ViewBranchTransactions_filter" gutter={[15, 15]}>
		<Col lg={12} span={24}>
			<Label label="Status" spacing />
			<Select
				style={{ width: '100%' }}
				value={params.status}
				onChange={(value) => {
					setQueryParams({ status: value });
				}}
				allowClear
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
