import { Button, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { toString } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
	RequestErrors,
	TableHeader,
	TimeRangeFilter,
	ViewAccountModal,
} from '../../../../../components';
import { EMPTY_CELL } from '../../../../../global/constants';
import { pageSizeOptions } from '../../../../../global/options';
import { paymentTypes, timeRangeTypes } from '../../../../../global/types';
import { useTransactions } from '../../../../../hooks';
import { useQueryParams } from '../../../../../hooks/useQueryParams';
import { useTimeRange } from '../../../../../hooks/useTimeRange';
import {
	convertIntoArray,
	formatDateTime,
	formatInPeso,
} from '../../../../../utils/function';
import '../../style.scss';

const columns: ColumnsType = [
	{ title: 'Date & Time', dataIndex: 'datetime' },
	{ title: 'Client Code', dataIndex: 'client_code' },
	{ title: 'Invoice Number', dataIndex: 'invoice_number' },
	{ title: 'Amount', dataIndex: 'amount' },
	{ title: 'Cashier', dataIndex: 'cashier' },
	{ title: 'Authorizer', dataIndex: 'authorizer' },
];

export const TabCreditTransactions = () => {
	// STATES
	const [dataSource, setDataSource] = useState([]);
	const [selectedTransaction, setSelectedTransaction] = useState(null);
	const [selectedAccount, setSelectedAccount] = useState(null);

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
				client_code: EMPTY_CELL, // TODO: set correct value
				invoice_number: (
					<Button
						type="link"
						onClick={() => setSelectedTransaction(transaction)}
					>
						{invoice.id}
					</Button>
				),
				amount: formatInPeso(total_amount),
				cashier: employee_id,
				authorizer: EMPTY_CELL, // TODO: set correct value
			};
		});

		setDataSource(formattedTransactions);
	}, [transactions]);

	return (
		<div>
			<TableHeader title="Credit Transactions" />

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

			{selectedAccount && (
				<ViewAccountModal
					account={selectedAccount}
					onClose={() => setSelectedAccount(null)}
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
		<Row className="TabCreditTransactions_filter" gutter={[15, 15]}>
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
