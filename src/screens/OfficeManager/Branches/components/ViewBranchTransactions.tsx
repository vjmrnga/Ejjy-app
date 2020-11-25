import React, { useEffect, useState } from 'react';
import { TableHeader, TableNormal } from '../../../../components';
import { ButtonLink } from '../../../../components/elements';
import { EMPTY_CELL } from '../../../../global/constants';
import { getTranscationStatus, numberWithCommas } from '../../../../utils/function';
import { ViewTransactionModal } from './ViewTransactionModal';

interface Props {
	transactions: any;
}

const columns = [{ name: 'ID' }, { name: 'Invoice' }, { name: 'Amount' }, { name: 'Status' }];

export const ViewBranchTransactions = ({ transactions }: Props) => {
	// TODO Implement searching later on
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [data, setData] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [viewTransactionModalVisible, setViewTransactionModalVisible] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState(null);

	// Effect: Format branch transactions to be rendered in Table
	useEffect(() => {
		const formattedBranchTransactions = transactions.map((branchTransaction) => {
			const { id, invoice, total_amount, status } = branchTransaction;

			return [
				{ isHidden: true },
				<ButtonLink text={id} onClick={() => onView(branchTransaction)} />,
				invoice?.id || EMPTY_CELL,
				`₱${numberWithCommas(total_amount?.toFixed(2))}`,
				getTranscationStatus(status),
			];
		});

		setData(formattedBranchTransactions);
		setTableData(formattedBranchTransactions);
	}, [transactions]);

	const onView = (transaction) => {
		setSelectedTransaction(transaction);
		setViewTransactionModalVisible(true);
	};

	return (
		<>
			<TableHeader title="Transactions" />

			<TableNormal columns={columns} data={tableData} />

			<ViewTransactionModal
				transaction={selectedTransaction}
				visible={viewTransactionModalVisible}
				onClose={() => setViewTransactionModalVisible(false)}
			/>
		</>
	);
};
