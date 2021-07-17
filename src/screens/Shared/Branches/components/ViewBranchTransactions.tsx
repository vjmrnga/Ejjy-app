import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import {
	RequestErrors,
	RequestWarnings,
	TableHeader,
} from '../../../../components';
import { ButtonLink } from '../../../../components/elements';
import { EMPTY_CELL } from '../../../../global/constants';
import { pageSizeOptions } from '../../../../global/options';
import { request } from '../../../../global/types';
import { useTransactions } from '../../../../hooks/useTransactions';
import {
	convertIntoArray,
	getTransactionStatus,
	numberWithCommas,
} from '../../../../utils/function';
import { ViewTransactionModal } from './ViewTransactionModal';

const columns: ColumnsType = [
	{ title: 'ID', dataIndex: 'id', key: 'id' },
	{ title: 'Invoice', dataIndex: 'invoice', key: 'invoice' },
	{ title: 'Amount', dataIndex: 'amount', key: 'amount' },
	{ title: 'Status', dataIndex: 'status', key: 'status' },
];

interface Props {
	branchId: any;
}

export const ViewBranchTransactions = ({ branchId }: Props) => {
	// STATES
	const [data, setData] = useState([]);
	const [viewTransactionModalVisible, setViewTransactionModalVisible] =
		useState(false);
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

	// METHODS
	useEffect(() => {
		listTransactions({ branchId, page: 1 });
	}, []);

	// Effect: Format branch transactions to be rendered in Table
	useEffect(() => {
		const formattedBranchTransactions = transactions.map(
			(branchTransaction) => {
				const {
					id,
					invoice,
					total_amount,
					status: transactionStatus,
				} = branchTransaction;

				return {
					id: (
						<ButtonLink text={id} onClick={() => onView(branchTransaction)} />
					),
					invoice: invoice?.or_number || EMPTY_CELL,
					amount: `₱${numberWithCommas(total_amount?.toFixed(2))}`,
					transactionStatus: getTransactionStatus(transactionStatus),
				};
			},
		);

		setData(formattedBranchTransactions);
	}, [transactions]);

	const onView = (transaction) => {
		setSelectedTransaction(transaction);
		setViewTransactionModalVisible(true);
	};

	const onPageChange = (page) => {
		listTransactions({ branchId, page });
	};

	return (
		<>
			<TableHeader title="Transactions" />

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
					onChange: onPageChange,
					disabled: !data,
					position: ['bottomCenter'],
					pageSizeOptions,
				}}
				loading={status === request.REQUESTING}
			/>

			<ViewTransactionModal
				transaction={selectedTransaction}
				visible={viewTransactionModalVisible}
				onClose={() => setViewTransactionModalVisible(false)}
			/>
		</>
	);
};
