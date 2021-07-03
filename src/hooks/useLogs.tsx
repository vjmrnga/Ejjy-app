import { useEffect, useState } from 'react';
import { actions, types } from '../ducks/Admin/logs';
import { request } from '../global/types';
import { onCallback } from '../utils/function';
import {
	executePaginatedRequest,
	getDataForCurrentPage,
	updateInCachedData,
} from '../utils/pagination';
import { useActionDispatch } from './useActionDispatch';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching logs';

export const useLogs = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	// PAGINATION
	const [allData, setAllData] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageData, setCurrentPageData] = useState([]);
	const [pageSize, setPageSize] = useState(10);

	// ACTIONS
	const getUpdateBranchProductBalanceLogsAction = useActionDispatch(
		actions.getUpdateBranchProductBalanceLogs,
	);

	// GENERAL METHODS
	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetPagination = () => {
		setAllData([]);
		setPageCount(0);
		setCurrentPage(1);
		setCurrentPageData([]);
	};

	const resetAll = () => {
		reset();
		resetPagination();
	};

	const executeRequest = (data, requestCallback, action, type) => {
		setRecentRequest(type);
		action({
			...data,
			callback: onCallback(
				callback,
				requestCallback?.onSuccess,
				requestCallback?.onError,
			),
		});
	};

	const callback = ({ status: requestStatus, errors: requestErrors = [] }) => {
		setStatus(requestStatus);
		setErrors(requestErrors);
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
	}, [allData, currentPage]);

	const updateItemInPagination = (item) => {
		setAllData((data) => updateInCachedData({ data, item }));
	};

	// REQUEST METHODS
	const getUpdateBranchProductBalanceLogs = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: getUpdateBranchProductBalanceLogsAction,
			requestType: types.GET_UPDATE_BRANCH_PRODUCT_BALANCE_LOGS,
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

	return {
		logs: currentPageData,
		pageCount,
		currentPage,
		pageSize,
		updateItemInPagination,

		getUpdateBranchProductBalanceLogs,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
		resetAll,
	};
};
