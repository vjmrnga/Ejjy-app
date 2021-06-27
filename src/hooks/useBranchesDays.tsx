/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/branches-days';
import { request } from '../global/types';
import { onCallback } from '../utils/function';
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

	// SELECTORS
	const branchDay = useSelector(selectors.selectBranchDay());

	// ACTIONS
	const listBranchDaysAction = useActionDispatch(actions.listBranchDays);
	const getBranchDay = useActionDispatch(actions.getBranchDay);
	const createBranchDay = useActionDispatch(actions.createBranchDay);
	const editBranchDay = useActionDispatch(actions.editBranchDay);

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
		setPageSize(10);
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
			resetPagination,
		});
	};

	const getBranchDayRequest = (branchId) => {
		setRecentRequest(types.GET_BRANCH_DAY);
		getBranchDay({
			branch_id: branchId,
			callback,
		});
	};

	const createBranchDayRequest = (branchId, startedById, onlineStartedById) => {
		setRecentRequest(types.CREATE_BRANCH_DAY);
		createBranchDay({
			branch_id: branchId,
			started_by_id: startedById,
			online_started_by_id: onlineStartedById,
			callback,
		});
	};

	const editBranchDayRequest = (branchId, branchDayId, endedById, onlineStartedById) => {
		setRecentRequest(types.EDIT_BRANCH_DAY);
		editBranchDay({
			id: branchDayId,
			branch_id: branchId,
			ended_by_id: endedById,
			online_started_by_id: onlineStartedById,
			callback,
		});
	};

	const callback = ({ status, errors = [], warnings = [] }) => {
		setStatus(status);
		setErrors(errors);
		setWarnings(warnings);
	};

	return {
		branchDay,
		branchDays: currentPageData,
		pageCount,
		currentPage,
		pageSize,
		addItemInPagination,
		updateItemInPagination,
		removeItemInPagination,

		listBranchDays,
		getBranchDay: getBranchDayRequest,
		createBranchDay: createBranchDayRequest,
		editBranchDay: editBranchDayRequest,
		status,
		errors,
		warnings,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
