/* eslint-disable react-hooks/exhaustive-deps */
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { actions, types } from '../ducks/Admin/logs';
import { MAX_PAGE_SIZE } from '../global/constants';
import { request } from '../global/types';
import { onCallback } from '../utils/function';
import {
	generateNewCachedData,
	getDataForCurrentPage,
	indexHasCachedData,
	updateInCachedData,
} from '../utils/pagination';
import { useActionDispatch } from './useActionDispatch';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching logs';

export const useLogs = ({ pageSize = MAX_PAGE_SIZE } = {}) => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	// PAGINATION
	const [allData, setAllData] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageData, setCurrentPageData] = useState([]);

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

	const requestCallback = ({ status: requestStatus, errors: requestErrors = [] }) => {
		setStatus(requestStatus);
		setErrors(requestErrors);
	};

	const executeRequest = (data, callback, action, type) => {
		setRecentRequest(type);
		action({
			...data,
			callback: onCallback(requestCallback, callback?.onSuccess, callback?.onError),
		});
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
		if (shouldReset) {
			resetPagination();
		}

		const { page } = data;
		setCurrentPage(page);

		if (
			!indexHasCachedData({
				existingData: allData,
				index: (page - 1) * pageSize,
			}) ||
			shouldReset
		) {
			const callback = {
				onSuccess: ({ data: { results: toBeAddedData, count } }) => {
					setAllData((currentAllData) =>
						generateNewCachedData({
							existingData: currentAllData,
							toBeAddedData,
							index: (page - 1) * pageSize,
						}),
					);

					setPageCount(count);
				},
				onError: () => message.error(LIST_ERROR_MESSAGE),
			};

			executeRequest(
				{ ...data, pageSize },
				callback,
				getUpdateBranchProductBalanceLogsAction,
				types.GET_UPDATE_BRANCH_PRODUCT_BALANCE_LOGS,
			);
		}
	};

	return {
		logs: currentPageData,
		pageCount,
		currentPage,
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
