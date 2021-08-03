import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';
import { PendingApprovalBadgePill, TableActions } from '..';
import { request } from '../../global/types';
import { usePendingTransactions } from '../../hooks/usePendingTransactions';
import { formatDateTime, showErrorMessages } from '../../utils/function';
import Box from '../elements/Box/Box';
import { TableHeader } from '../Table/TableHeaders/TableHeader';

interface Props {
	title: string;
	transactionType: any;
	setHasPendingTransactions?: any;
	withActionColumn?: boolean;
}

const PendingTransactionsSectionComponent = (
	{
		title,
		transactionType,
		setHasPendingTransactions,
		withActionColumn,
	}: Props,
	ref,
) => {
	// STATES
	const [pendingTransactions, setPendingTransactions] = useState([]);
	const [data, setData] = useState([]);

	// CUSTOM HOOKS
	const {
		listPendingTransactions,
		editPendingTransaction,
		executePendingTransaction,
		removePendingTransaction,
		status: pendingTransactionsStatus,
	} = usePendingTransactions();

	// METHODS
	useEffect(() => {
		fetchPendingTransactions();
	}, []);

	// Effect: Format pending transactions to be rendered in Table
	useEffect(() => {
		setHasPendingTransactions?.(pendingTransactions.length > 0);

		const formattedPendingTransactions = pendingTransactions
			.filter(({ request_model }) => request_model === transactionType)
			.map((pendingTransaction) => {
				const { name, branch, datetime_created, is_pending_approval } =
					pendingTransaction;

				const actions = is_pending_approval ? (
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
				);

				return {
					description: name,
					branch: branch?.name,
					datetime_created: formatDateTime(datetime_created),
					actions: withActionColumn ? actions : null,
				};
			});

		setData(formattedPendingTransactions);
	}, [pendingTransactions]);

	const getColumns = useCallback(() => {
		const columns: ColumnsType = [
			{ title: 'Description', dataIndex: 'description' },
			{ title: 'Branch', dataIndex: 'branch' },
			{ title: 'Datetime', dataIndex: 'datetime_created' },
		];

		if (withActionColumn) {
			columns.push({ title: 'Actions', dataIndex: 'actions' });
		}

		return columns;
	}, [withActionColumn]);

	const fetchPendingTransactions = () => {
		listPendingTransactions(
			{ requestModel: transactionType },
			({ status, data: responseData }) => {
				if (status === request.SUCCESS) {
					setPendingTransactions(responseData.results);
				}
			},
		);
	};

	const onExecutePendingTransaction = (pendingTransaction) => {
		// Note: We added 2 so we can skip the 'v1'
		const urlIndex = pendingTransaction.url.indexOf('v1');
		const urlPathName = pendingTransaction.url.slice(urlIndex + 3);
		const newUrl = `${pendingTransaction.branch.online_url}/${urlPathName}`;

		executePendingTransaction(
			{
				...pendingTransaction,
				url: newUrl,
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
					fetchPendingTransactions();
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
					fetchPendingTransactions();
				} else if (status === request.ERROR) {
					showErrorMessages(error);
				}
			},
			showFeedbackMessage,
		);
	};

	useImperativeHandle(
		ref,
		() => ({
			refreshList: () => {
				fetchPendingTransactions();
			},
		}),
		[pendingTransactions],
	);

	return (
		<section className="PendingTransactions">
			<Box>
				<TableHeader title={title} />

				<Table
					columns={getColumns()}
					dataSource={data}
					scroll={{ x: 800 }}
					pagination={false}
					loading={pendingTransactionsStatus === request.REQUESTING}
				/>
			</Box>
		</section>
	);
};

export const PendingTransactionsSection = forwardRef(
	PendingTransactionsSectionComponent,
);
