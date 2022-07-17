/* eslint-disable react/jsx-one-expression-per-line */
import { Spin } from 'antd';
import { CashieringCard, RequestErrors } from 'components';
import { Box, Button } from 'components/elements';
import { printCancelledTransactions } from 'configurePrinter';
import { MAX_PAGE_SIZE } from 'global';
import { useSiteSettingsRetrieve, useTransactions } from 'hooks';
import { useAuth } from 'hooks/useAuth';
import React, { useEffect, useState } from 'react';
import { convertIntoArray, formatInPeso, isUserFromBranch } from 'utils';

interface Props {
	branchId?: string;
	serverUrl?: string;
	timeRange?: string;
	statuses?: string;
}

export const TransactionsCancelled = ({
	branchId,
	serverUrl,
	timeRange,
	statuses,
}: Props) => {
	// STATES
	const [amount, setAmount] = useState(0);
	const [isPrinting, setIsPrinting] = useState(false);

	// CUSTOM HOOKS
	const { user } = useAuth();
	const {
		data: { transactions },
		isFetching: isTransactionsFetching,
		error: transactionsError,
	} = useTransactions({
		params: {
			timeRange,
			statuses,
			branchId,
			serverUrl,
			page: 1,
			pageSize: MAX_PAGE_SIZE,
		},
	});
	const {
		data: siteSettings,
		isFetching: isSiteSettingsFetching,
		error: siteSettingsError,
	} = useSiteSettingsRetrieve({
		params: { branchId },
	});

	useEffect(() => {
		const totalAmount = transactions.reduce(
			(previousValue, transaction) =>
				previousValue + Number(transaction.total_amount),
			0,
		);

		setAmount(totalAmount);
	}, [transactions]);

	const onPrint = () => {
		setIsPrinting(true);

		printCancelledTransactions({
			filterStatus: statuses,
			filterRange: timeRange,
			amount,
			transactions,
			siteSettings,
			onComplete: () => {
				setIsPrinting(false);
			},
		});
	};

	return (
		<Box className="TransactionsCancelled">
			<Spin spinning={isTransactionsFetching || isSiteSettingsFetching}>
				<div className="TransactionsCancelled_container">
					<RequestErrors
						errors={[
							...convertIntoArray(transactionsError, 'Transactions'),
							...convertIntoArray(siteSettingsError, 'Site Settings'),
						]}
						withSpaceBottom
					/>

					<div>
						<p className="TransactionsCancelled_title">
							{formatInPeso(amount)}
						</p>
						<span className="TransactionsCancelled_date">
							{transactions.length} Cancelled Transactions
						</span>
					</div>

					{!isUserFromBranch(user.user_type) && (
						<Button
							disabled={transactions.length === 0}
							loading={isPrinting}
							text="Print"
							variant="primary"
							onClick={onPrint}
						/>
					)}
				</div>
			</Spin>
		</Box>
	);
};

CashieringCard.defaultProps = {
	className: undefined,
	bordered: false,
};
