import { useEffect, useState } from 'react';
import { actions, types } from '../ducks/return-item-slips';
import { request } from '../global/types';
import {
	modifiedCallback,
	modifiedExtraCallback,
	onCallback,
} from '../utils/function';
import {
	addInCachedData,
	executePaginatedRequest,
	getDataForCurrentPage,
	removeInCachedData,
	updateInCachedData,
} from '../utils/pagination';
import { useActionDispatch } from './useActionDispatch';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching return item slips';

const CREATE_SUCCESS_MESSAGE = 'Return item slip was created successfully';
const CREATE_ERROR_MESSAGE =
	'An error occurred while creating the return item slip';

const EDIT_SUCCESS_MESSAGE = 'Return item slip was edited successfully';
const EDIT_ERROR_MESSAGE =
	'An error occurred while updating the return item slip';

const RECEIVE_SUCCESS_MESSAGE = 'Return item slip was received successfully';
const RECEIVE_ERROR_MESSAGE =
	'An error occurred while receiving the return item slip';

export const useReturnItemSlips = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	// PAGINATION
	const [allData, setAllData] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageData, setCurrentPageData] = useState([]);
	const [pageSize, setPageSize] = useState(5);

	// ACTIONS
	const getReturnItemSlipsAction = useActionDispatch(
		actions.getReturnItemSlips,
	);
	const createReturnItemSlipAction = useActionDispatch(
		actions.createReturnItemSlip,
	);
	const editReturnItemSlipAction = useActionDispatch(
		actions.editReturnItemSlip,
	);
	const receiveReturnItemSlipAction = useActionDispatch(
		actions.receiveReturnItemSlip,
	);

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
	const getReturnItemSlips = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: getReturnItemSlipsAction,
			requestType: types.GET_RETURN_ITEM_SLIPS,
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

	const createReturnItemSlip = (data, extraCallback = null) => {
		createReturnItemSlipAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(
					callback,
					CREATE_SUCCESS_MESSAGE,
					CREATE_ERROR_MESSAGE,
				),
				extraCallback,
			),
		});
	};

	const editReturnItemSlip = (data, extraCallback = null) => {
		editReturnItemSlipAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(callback, EDIT_SUCCESS_MESSAGE, EDIT_ERROR_MESSAGE),
				extraCallback,
			),
		});
	};

	const receiveReturnItemSlip = (data, extraCallback = null) => {
		receiveReturnItemSlipAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(
					callback,
					RECEIVE_SUCCESS_MESSAGE,
					RECEIVE_ERROR_MESSAGE,
				),
				extraCallback,
			),
		});
	};

	return {
		returnItemSlips: currentPageData,
		pageCount,
		currentPage,
		pageSize,
		addItemInPagination,
		updateItemInPagination,
		removeItemInPagination,

		getReturnItemSlips,
		createReturnItemSlip,
		editReturnItemSlip,
		receiveReturnItemSlip,
		status,
		errors,
	};
};