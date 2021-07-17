import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { PendingApprovalBadgePill, TableActions } from '..';
import { request } from '../../global/types';
import { usePendingTransactions } from '../../hooks/usePendingTransactions';
import { formatDateTime, showErrorMessages } from '../../utils/function';
import Box from '../elements/Box/Box';
import { TableHeader } from '../Table/TableHeaders/TableHeader';

interface Props {
	title: string;
	transactionType: any;
}

const columns: ColumnsType = [
	{ title: 'Description', dataIndex: 'description' },
	{ title: 'Branch', dataIndex: 'branch' },
	{ title: 'Datetime', dataIndex: 'datetime_created' },
	{ title: 'Actions', dataIndex: 'actions' },
];

export const PendingTransactionsSection = ({
	title,
	transactionType,
}: Props) => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		pendingTransactions,
		listPendingTransactions,
		editPendingTransaction,
		executePendingTransaction,
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
			.filter(({ request_model }) => request_model === transactionType)
			.map((pendingTransaction) => {
				const { name, branch, datetime_created, is_pending_approval } =
					pendingTransaction;

				return {
					description: name,
					branch: branch?.name,
					datetime_created: formatDateTime(datetime_created),
					actions: is_pending_approval ? (
						<PendingApprovalBadgePill />
					) : (
						<TableActions
							onExecutePendingTransaction={() => {
								onExecutePendingTransaction(pendingTransaction);
							}}
							onRemove={() => {
								onAskApprovalPendingTransaction(pendingTransaction.id);
							}}
						/>
					),
				};
			});

		setData(formattedPendingTransactions);
	}, [pendingTransactions]);

	const onExecutePendingTransaction = (pendingTransaction) => {
		executePendingTransaction(
			{
				...pendingTransaction,
				request_body: JSON.parse(pendingTransaction?.request_body || '{}'),
				request_query_params: JSON.parse(
					pendingTransaction?.request_query_params || '{}',
				),
			},
			({ status, error }) => {
				if (status === request.SUCCESS) {
					onRemovePendingTransaction(pendingTransaction.id, false);
				} else if (status === request.ERROR) {
					showErrorMessages(error);
				}
			},
			true,
		);
	};

	const onAskApprovalPendingTransaction = (pendingTransactionId) => {
		editPendingTransaction(
			{ id: pendingTransactionId, is_pending_approval: true },
			({ status, error }) => {
				if (status === request.SUCCESS) {
					listPendingTransactions(null);
				} else if (status === request.ERROR) {
					showErrorMessages(error);
				}
			},
		);
	};

	const onRemovePendingTransaction = (
		pendingTransactionId,
		showFeedbackMessage,
	) => {
		removePendingTransaction(
			{ id: pendingTransactionId },
			({ status, error }) => {
				if (status === request.SUCCESS) {
					listPendingTransactions(null);
				} else if (status === request.ERROR) {
					showErrorMessages(error);
				}
			},
			showFeedbackMessage,
		);
	};

	return (
		<section className="PendingTransactions">
			<Box>
				<TableHeader title={title} />

				<Table
					columns={columns}
					dataSource={data}
					scroll={{ x: 800 }}
					pagination={false}
					loading={pendingTransactionsStatus === request.REQUESTING}
				/>
			</Box>
		</section>
	);
};
