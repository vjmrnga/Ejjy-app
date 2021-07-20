/* eslint-disable no-mixed-spaces-and-tabs */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
	actions,
	selectors,
	types,
} from '../ducks/OfficeManager/pending-transactions';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';
import { modifiedCallback, modifiedExtraCallback } from '../utils/function';

const REMOVE_SUCCESS_MESSAGE = 'Pending transaction was removed successfully';
const REMOVE_ERROR_MESSAGE =
	'An error occurred while removing the pending transaction';

const EXECUTE_SUCCESS_MESSAGE = 'Pending transaction was executed successfully';
const EXECUTE_ERROR_MESSAGE =
	'An error occurred while executing the pending transaction';

export const usePendingTransactions = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const pendingTransactions = useSelector(
		selectors.selectPendingTransactions(),
	);
	const pendingTransactionsCount = useSelector(
		selectors.selectPendingTransactionsCount(),
	);
	const listPendingTransactionsAction = useActionDispatch(
		actions.listPendingTransactions,
	);
	const editPendingTransactionsAction = useActionDispatch(
		actions.editPendingTransaction,
	);
	const removePendingTransactionsAction = useActionDispatch(
		actions.removePendingTransaction,
	);
	const executePendingTransactionsAction = useActionDispatch(
		actions.executePendingTransaction,
	);
	const getPendingTransactionsCountAction = useActionDispatch(
		actions.getPendingTransactionsCount,
	);

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const callback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
	};

	const listPendingTransactions = (data, extraCallback = null) => {
		setRecentRequest(types.LIST_PENDING_TRANSACTIONS);
		listPendingTransactionsAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const getPendingTransactionsCount = (data, extraCallback = null) => {
		setRecentRequest(types.GET_PENDING_TRANSACTIONS_COUNT);
		getPendingTransactionsCountAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const editPendingTransaction = (data, extraCallback = null) => {
		setRecentRequest(types.EDIT_PENDING_TRANSACTION);
		editPendingTransactionsAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const executePendingTransaction = (
		data,
		extraCallback = null,
		showFeedbackMessage,
	) => {
		setRecentRequest(types.EXECUTE_PENDING_TRANSACTION);
		executePendingTransactionsAction({
			...data,
			callback: modifiedExtraCallback(
				showFeedbackMessage
					? modifiedCallback(
							callback,
							EXECUTE_SUCCESS_MESSAGE,
							EXECUTE_ERROR_MESSAGE,
					  )
					: callback,
				extraCallback,
			),
		});
	};

	const removePendingTransaction = (
		data,
		extraCallback = null,
		showFeedbackMessage,
	) => {
		setRecentRequest(types.REMOVE_PENDING_TRANSACTION);
		removePendingTransactionsAction({
			...data,
			callback: modifiedExtraCallback(
				showFeedbackMessage
					? modifiedCallback(
							callback,
							REMOVE_SUCCESS_MESSAGE,
							REMOVE_ERROR_MESSAGE,
					  )
					: callback,
				extraCallback,
			),
		});
	};

	return {
		pendingTransactions,
		pendingTransactionsCount,
		listPendingTransactions,
		getPendingTransactionsCount,
		editPendingTransaction,
		removePendingTransaction,
		executePendingTransaction,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
