import { Col, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { toString } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
	RequestErrors,
	RequestWarnings,
	TableHeader,
	TimeRangeFilter,
	ViewTransactionModal,
} from '../../../../components';
import { ButtonLink, Label } from '../../../../components/elements';
import { EMPTY_CELL } from '../../../../global/constants';
import { pageSizeOptions } from '../../../../global/options';
import { timeRangeTypes, transactionStatus } from '../../../../global/types';
import { useTransactions } from '../../../../hooks';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import { useTimeRange } from '../../../../hooks/useTimeRange';
import {
	convertIntoArray,
	formatInPeso,
	getTransactionStatus,
} from '../../../../utils/function';
import { TransactionsCancelled } from '../../../Shared/Branches/components/BranchTransactions/TransactionsCancelled';

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

const voidedStatuses = [
	transactionStatus.VOID_CANCELLED,
	transactionStatus.VOID_EDITED,
];

interface Props {
	branchMachineId: number;
	serverUrl: any;
}

export const ViewBranchTransactions = ({
	branchMachineId,
	serverUrl,
}: Props) => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);

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
		data: { transactions, total, warning },
		isFetching,
		error,
	} = useTransactions({
		params: { serverUrl, branchMachineId, ...queryParams },
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
					key: id,
					id: (
						<ButtonLink
							text={id}
							onClick={() => setSelectedTransaction(branchTransaction)}
						/>
					),
					invoice: invoice?.or_number || EMPTY_CELL,
					amount: formatInPeso(total_amount),
					status: getTransactionStatus(branchTransactionStatus),
				};
			},
		);

		setDataSource(formattedBranchTransactions);
	}, [transactions]);

	return (
		<>
			<TableHeader title="Transactions" />

			<Filter
				params={queryParams}
				setQueryParams={(params) => {
					setQueryParams(params, { shouldResetPage: true });
				}}
				isLoading={isFetching}
			/>

			<RequestErrors errors={convertIntoArray(error)} />
			<RequestWarnings warnings={convertIntoArray(warning)} />

			{voidedStatuses.includes(toString(queryParams?.statuses)) && (
				<TransactionsCancelled
					serverUrl={serverUrl}
					timeRange={toString(queryParams?.timeRange)}
					statuses={toString(queryParams?.statuses)}
				/>
			)}

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

interface FilterProps {
	params: any;
	isLoading: boolean;
	setQueryParams: any;
}

const Filter = ({ params, isLoading, setQueryParams }: FilterProps) => {
	const { timeRangeType, setTimeRangeType } = useTimeRange({ params });

	return (
		<Row className="ViewBranchMachineTransactions_filter" gutter={[15, 15]}>
			<Col lg={12} span={24}>
				<TimeRangeFilter
					timeRange={params.timeRange}
					timeRangeType={timeRangeType}
					setTimeRangeType={setTimeRangeType}
					setQueryParams={setQueryParams}
					disabled={isLoading}
				/>
			</Col>
			<Col lg={12} span={24}>
				<Label label="Status" spacing />
				<Select
					style={{ width: '100%' }}
					value={params.statuses}
					onChange={(value) => {
						setQueryParams({ statuses: value });
					}}
					disabled={isLoading}
					optionFilterProp="children"
					filterOption={(input, option) =>
						option.children
							.toString()
							.toLowerCase()
							.indexOf(input.toLowerCase()) >= 0
					}
					showSearch
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
};
