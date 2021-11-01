/* eslint-disable react/jsx-one-expression-per-line */
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { CashieringCard, RequestErrors } from '../../../../../components';
import { Box, Button } from '../../../../../components/elements';
import { printCancelledTransactions } from '../../../../../configurePrinter';
import { MAX_PAGE_SIZE } from '../../../../../global/constants';
import { request } from '../../../../../global/types';
import { useSiteSettings } from '../../../../../hooks/useSiteSettings';
import { useTransactions } from '../../../../../hooks/useTransactions';
import {
	convertIntoArray,
	numberWithCommas,
} from '../../../../../utils/function';

interface Props {
	branchId: string;
	timeRange?: string;
	statuses?: string;
}

export const TransactionsCancelled = ({
	branchId,
	timeRange,
	statuses,
}: Props) => {
	// STATES
	const [amount, setAmount] = useState(0);
	const [isPrinting, setIsPrinting] = useState(false);

	// CUSTOM HOOKS
	const {
		transactions,
		listTransactions,
		status: transactionsStatus,
		errors: transactionsErrors,
	} = useTransactions();
	const {
		getSiteSettings,
		status: siteSettingsStatus,
		errors: siteSettingsErrors,
	} = useSiteSettings();

	useEffect(() => {
		listTransactions(
			{
				timeRange,
				statuses,
				branchId,
				page: 1,
				pageSize: MAX_PAGE_SIZE,
			},
			true,
		);
	}, [branchId, timeRange, statuses]);

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
		getSiteSettings({ branchId }, ({ status, data: siteSettings }) => {
			if (status === request.SUCCESS) {
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
			} else if (status === request.ERROR) {
				setIsPrinting(false);
			}
		});
	};

	return (
		<Box className="TransactionsCancelled">
			<Spin spinning={transactionsStatus === request.REQUESTING}>
				<div className="TransactionsCancelled_container">
					<RequestErrors
						errors={[
							...convertIntoArray(transactionsErrors, 'Transactions'),
							...convertIntoArray(siteSettingsErrors, 'Site Settings'),
						]}
						withSpaceBottom
					/>

					<div>
						<p className="TransactionsCancelled_title">
							{`₱${numberWithCommas(amount?.toFixed(2))}`}
						</p>
						<span className="TransactionsCancelled_date">
							{transactions.length} Cancelled Transactions
						</span>
					</div>

					<Button
						text="Print"
						variant="primary"
						onClick={onPrint}
						loading={isPrinting}
						disabled={transactions.length === 0}
					/>
				</div>
			</Spin>
		</Box>
	);
};

CashieringCard.defaultProps = {
	className: undefined,
	bordered: false,
	disabled: false,
	loading: false,
};
