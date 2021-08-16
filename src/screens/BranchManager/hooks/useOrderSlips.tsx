import { useEffect, useState } from 'react';
import { actions, types } from '../../../ducks/order-slips';
import { request } from '../../../global/types';
import { useActionDispatch } from '../../../hooks/useActionDispatch';
import { modifiedExtraCallback, onCallback } from '../../../utils/function';
import {
	addInCachedData,
	executePaginatedRequest,
	getDataForCurrentPage,
	removeInCachedData,
	updateInCachedData,
} from '../../../utils/pagination';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching order slips';

export const useOrderSlips = () => {
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
	const getOrderSlipsExtendedAction = useActionDispatch(
		actions.getOrderSlipsExtended,
	);
	const getPendingCountAction = useActionDispatch(actions.getPendingCount);

	// GENERAL METHODS
	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const requestCallback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
	};

	const executeRequest = (data, callback, action, type) => {
		setRecentRequest(type);
		action({
			...data,
			callback: onCallback(
				requestCallback,
				callback?.onSuccess,
				callback?.onError,
			),
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

	const getOrderSlipsExtended = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: getOrderSlipsExtendedAction,
			requestType: types.GET_ORDER_SLIPS_EXTENDED,
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

	const getPendingCount = (data, extraCallback = null) => {
		setRecentRequest(types.GET_PENDING_COUNT);
		getPendingCountAction({
			...data,
			callback: modifiedExtraCallback(requestCallback, extraCallback),
		});
	};

	return {
		orderSlips: currentPageData,
		pageCount,
		currentPage,
		pageSize,
		addItemInPagination,
		updateItemInPagination,
		removeItemInPagination,

		getOrderSlipsExtended,
		getPendingCount,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
