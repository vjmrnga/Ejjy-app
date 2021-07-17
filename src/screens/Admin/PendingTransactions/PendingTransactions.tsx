import Table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Content, TableActions } from '../../../components';
import { Box } from '../../../components/elements';
import { TableHeader } from '../../../components/Table/TableHeaders/TableHeader';
import { request } from '../../../global/types';
import { usePendingTransactions } from '../../../hooks/usePendingTransactions';
import { formatDateTime, showErrorMessages } from '../../../utils/function';

const columns: ColumnsType = [
	{ title: 'Description', dataIndex: 'description', key: 'description' },
	{ title: 'Branch', dataIndex: 'branch', key: 'branch' },
	{ title: 'Datetime', dataIndex: 'datetime_created', key: 'datetime_created' },
	{ title: 'Actions', dataIndex: 'actions', key: 'actions' },
];

export const PendingTransactions = () => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		pendingTransactions,
		listPendingTransactions,
		editPendingTransaction,
		removePendingTransaction,
		status: pendingTransactionsStatus,
	} = usePendingTransactions();

	// METHODS
	useEffect(() => {
		listPendingTransactions(null);
	}, []);

	// Effect: Format pending transactions to be rendered in Table
	useEffect(() => {
		const formattedPendingTransactions = pendingTransactions
			.filter(({ is_pending_approval }) => is_pending_approval)
			.map((pendingTransaction) => {
				const { id, name, branch, datetime_created } = pendingTransaction;

				return {
					description: name,
					branch: branch?.name,
					datetime_created: formatDateTime(datetime_created),
					actions: (
						<TableActions
							onRestore={() => {
								editPendingTransaction(
									{ id, is_pending_approval: false },
									({ status, error }) => {
										if (status === request.SUCCESS) {
											listPendingTransactions(null);
										} else if (status === request.ERROR) {
											showErrorMessages(error);
										}
									},
								);
							}}
							onRemove={() => {
								removePendingTransaction(
									{ id },
									({ status, error }) => {
										if (status === request.SUCCESS) {
											listPendingTransactions(null);
										} else if (status === request.ERROR) {
											showErrorMessages(error);
										}
									},
									true,
								);
							}}
						/>
					),
				};
			});

		setData(formattedPendingTransactions);
	}, [pendingTransactions]);

	return (
		<Content className="PendingTransactions" title="Pending Transactions">
			<Box>
				<TableHeader />

				<Table
					columns={columns}
					dataSource={data}
					scroll={{ x: 800 }}
					pagination={false}
					loading={pendingTransactionsStatus === request.REQUESTING}
				/>
			</Box>
		</Content>
	);
};
