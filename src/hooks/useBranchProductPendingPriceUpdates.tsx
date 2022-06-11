import { useEffect, useState } from 'react';
import { actions } from '../ducks/branch-product-pending-price-updates';
import { request } from '../global/types';
import { modifiedExtraCallback, onCallback } from 'utils';
import {
	executePaginatedRequest,
	getDataForCurrentPage,
} from '../utils/pagination';
import { useActionDispatch } from './useActionDispatch';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching transactions.';

export const useBranchProductPendingPriceUpdates = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	// PAGINATION
	const [allData, setAllData] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageData, setCurrentPageData] = useState([]);
	const [pageSize, setPageSize] = useState(10);

	// ACTIONS
	const listAction = useActionDispatch(actions.list);
	const applyAction = useActionDispatch(actions.apply);

	// GENERAL METHODS
	const executeRequest = (data, requestCallback, action) => {
		action({
			...data,
			callback: onCallback(
				callback,
				requestCallback?.onSuccess,
				requestCallback?.onError,
			),
		});
	};

	const callback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
	};

	// PAGINATION METHODS
	useEffect(() => {
		setCurrentPageData(
			getDataForCurrentPage({
				data: allData,
				currentPage,
				pageSize,
			}),
		);
	}, [allData, currentPage, pageSize]);

	// REQUEST METHODS
	const listBranchProductPendingPriceUpdates = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: listAction,
			requestType: null,
			errorMessage: LIST_ERROR_MESSAGE,
			allData,
			pageSize,
			executeRequest,
			setAllData,
			setPageCount,
			setCurrentPage,
			setPageSize,
		});
	};

	const applyBranchProductPendingPriceUpdate = (data, extraCallback = null) => {
		applyAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	return {
		pendingPriceUpdates: currentPageData,
		pageCount,
		currentPage,
		pageSize,

		listBranchProductPendingPriceUpdates,
		applyBranchProductPendingPriceUpdate,
		status,
		errors,
	};
};
