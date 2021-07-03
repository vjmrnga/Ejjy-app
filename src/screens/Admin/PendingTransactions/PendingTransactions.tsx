import React, { useEffect, useState } from 'react';
import { Container, Table, TableActions } from '../../../components';
import { Box } from '../../../components/elements';
import { TableHeader } from '../../../components/Table/TableHeaders/TableHeader';
import { request } from '../../../global/types';
import { usePendingTransactions } from '../../../hooks/usePendingTransactions';
import {
	calculateTableHeight,
	formatDateTime,
	showErrorMessages,
} from '../../../utils/function';

const columns = [
	{ title: 'Description', dataIndex: 'description' },
	{ title: 'Branch', dataIndex: 'branch' },
	{ title: 'Datetime', dataIndex: 'datetime_created' },
	{ title: 'Actions', dataIndex: 'actions' },
];

const PendingTransactions = () => {
	// STATES
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		pendingTransactions,
		listPendingTransactions,
		removePendingTransactions,
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
				const { name, branch, datetime_created } = pendingTransaction;

				return {
					description: name,
					branch: branch?.name,
					datetime_created: formatDateTime(datetime_created),
					actions: (
						<TableActions
							onRemove={() => {
								onRemovePendingTransaction(pendingTransaction.id, true);
							}}
						/>
					),
				};
			});

		setData(formattedPendingTransactions);
	}, [pendingTransactions]);

	const onRemovePendingTransaction = (
		pendingTransactionId,
		showFeedbackMessage,
	) => {
		removePendingTransactions(
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
		<Container title="Pending Transactions">
			<section className="PendingTransactions">
				<Box>
					<TableHeader />

					<Table
						columns={columns}
						dataSource={data}
						scroll={{ y: calculateTableHeight(data.length), x: '100%' }}
						loading={pendingTransactionsStatus === request.REQUESTING}
					/>
				</Box>
			</section>
		</Container>
	);
};

export default PendingTransactions;
