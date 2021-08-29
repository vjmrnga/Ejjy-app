import { useEffect, useState } from 'react';
import { actions, types } from '../ducks/branches-days';
import { request } from '../global/types';
import { modifiedExtraCallback, onCallback } from '../utils/function';
import {
	addInCachedData,
	executePaginatedRequest,
	getDataForCurrentPage,
	removeInCachedData,
	updateInCachedData,
} from '../utils/pagination';
import { useActionDispatch } from './useActionDispatch';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching transactions.';

export const useBranchesDays = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [warnings, setWarnings] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	// PAGINATION
	const [allData, setAllData] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageData, setCurrentPageData] = useState([]);
	const [pageSize, setPageSize] = useState(10);

	// ACTIONS
	const listBranchDaysAction = useActionDispatch(actions.listBranchDays);
	const getBranchDayAction = useActionDispatch(actions.getBranchDay);
	const createBranchDayAction = useActionDispatch(actions.createBranchDay);
	const editBranchDayAction = useActionDispatch(actions.editBranchDay);

	// GENERAL METHODS
	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const reset = () => {
		resetError();
		resetStatus();
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

	const callback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
		warnings: callbackWarnings = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
		setWarnings(callbackWarnings);
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

	const addItemInPagination = (item) => {
		setAllData((data) => addInCachedData({ data, item }));
	};

	const updateItemInPagination = (item) => {
		setAllData((data) => updateInCachedData({ data, item }));
	};

	const removeItemInPagination = (item) => {
		setAllData((data) => removeInCachedData({ data, item }));
	};

	// REQUEST METHODS
	const listBranchDays = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: listBranchDaysAction,
			requestType: types.LIST_BRANCH_DAYS,
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

	const getBranchDay = (branchId, extraCallback = null) => {
		setRecentRequest(types.GET_BRANCH_DAY);
		getBranchDayAction({
			branchId,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const createBranchDay = (data, extraCallback = null) => {
		setRecentRequest(types.CREATE_BRANCH_DAY);
		createBranchDayAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const editBranchDay = (data, extraCallback = null) => {
		setRecentRequest(types.EDIT_BRANCH_DAY);
		editBranchDayAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	return {
		branchDays: currentPageData,
		pageCount,
		currentPage,
		pageSize,
		addItemInPagination,
		updateItemInPagination,
		removeItemInPagination,

		listBranchDays,
		getBranchDay,
		createBranchDay,
		editBranchDay,
		status,
		errors,
		warnings,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
