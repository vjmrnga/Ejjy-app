import { useEffect, useState } from 'react';
import { actions } from '../ducks/back-orders';
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

const LIST_ERROR_MESSAGE = 'An error occurred while fetching back orders';

const CREATE_SUCCESS_MESSAGE = 'Back order was created successfully';
const CREATE_ERROR_MESSAGE = 'An error occurred while creating the back order';

const EDIT_SUCCESS_MESSAGE = 'Back order was edited successfully';
const EDIT_ERROR_MESSAGE = 'An error occurred while updating the back order';

const RECEIVE_SUCCESS_MESSAGE = 'Back order was received successfully';
const RECEIVE_ERROR_MESSAGE =
	'An error occurred while receiving the back order';

export const useBackOrders = () => {
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
	const listAction = useActionDispatch(actions.list);
	const retrieveAction = useActionDispatch(actions.retrieve);
	const createAction = useActionDispatch(actions.create);
	const editAction = useActionDispatch(actions.edit);
	const receiveAction = useActionDispatch(actions.receive);

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
	const listBackOrders = (data, shouldReset = false) => {
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

	const retrieveBackOrder = (id, extraCallback = null) => {
		retrieveAction({
			id,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const createBackOrder = (data, extraCallback = null) => {
		createAction({
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

	const editBackOrder = (data, extraCallback = null) => {
		editAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(callback, EDIT_SUCCESS_MESSAGE, EDIT_ERROR_MESSAGE),
				extraCallback,
			),
		});
	};

	const receiveBackOrder = (data, extraCallback = null) => {
		receiveAction({
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
		backOrders: currentPageData,
		pageCount,
		currentPage,
		pageSize,
		addItemInPagination,
		updateItemInPagination,
		removeItemInPagination,

		listBackOrders,
		retrieveBackOrder,
		createBackOrder,
		editBackOrder,
		receiveBackOrder,
		status,
		errors,
	};
};
