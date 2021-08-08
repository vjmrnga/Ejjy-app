import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/requisition-slips';
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

const LIST_ERROR_MESSAGE = 'An error occurred while fetching requisition slips';

const CREATE_SUCCESS_MESSAGE = 'Requisition slip was created successfully';
const CREATE_ERROR_MESSAGE =
	'An error occurred while creating the requisition slip';

const EDIT_SUCCESS_MESSAGE = 'Requisition slip was edited successfully';
const EDIT_ERROR_MESSAGE =
	'An error occurred while updating the requisition slip';

const SET_OUT_OF_STOCK_SUCCESS_MESSAGE =
	'Products were set to out of stocks successfully';
const SET_OUT_OF_STOCK_ERROR_MESSAGE =
	'An error occurred while setting the products as out of stock';

export const useRequisitionSlips = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	// PAGINATION
	const [allData, setAllData] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageData, setCurrentPageData] = useState([]);
	const [pageSize, setPageSize] = useState(5);

	// SELECTORS
	const requisitionSlip = useSelector(selectors.selectRequisitionSlip());
	const requisitionSlipsByBranch = useSelector(
		selectors.selectRequisitionSlipsByBranch(),
	);
	const requisitionSlipForOutOfStock = useSelector(
		selectors.selectRequisitionSlipForOutOfStock(),
	);

	// ACTIONS
	const getRequisitionSlipsAction = useActionDispatch(
		actions.getRequisitionSlips,
	);
	const getRequisitionSlipsExtendedAction = useActionDispatch(
		actions.getRequisitionSlipsExtended,
	);

	const getRequisitionSlipsByIdAction = useActionDispatch(
		actions.getRequisitionSlipById,
	);
	const getRequisitionSlipsByIdAndBranch = useActionDispatch(
		actions.getRequisitionSlipByIdAndBranch,
	);
	const getPendingCountAction = useActionDispatch(actions.getPendingCount);
	const createRequisitionSlip = useActionDispatch(
		actions.createRequisitionSlip,
	);
	const editRequisitionSlip = useActionDispatch(actions.editRequisitionSlip);
	const removeRequisitionSlipByBranch = useActionDispatch(
		actions.removeRequisitionSlipByBranch,
	);
	const setOutOfStock = useActionDispatch(actions.setOutOfStock);

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
	const getRequisitionSlips = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: getRequisitionSlipsAction,
			requestType: types.GET_REQUISITION_SLIPS,
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

	const getRequisitionSlipsExtended = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: getRequisitionSlipsExtendedAction,
			requestType: types.GET_REQUISITION_SLIPS_EXTENDED,
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

	const getRequisitionSlipsById = (data, extraCallback = null) => {
		setRecentRequest(types.GET_REQUISITION_SLIP_BY_ID);
		getRequisitionSlipsByIdAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const getRequisitionSlipsByIdAndBranchRequest = (
		id,
		branchId,
		isForOutOfStock = false,
		extraCallback = null,
	) => {
		setRecentRequest(types.GET_REQUISITION_SLIP_BY_ID_AND_BRANCH);

		if (isForOutOfStock) {
			getRequisitionSlipsByIdAndBranch({
				id,
				branchId,
				isForOutOfStock,
				callback: modifiedExtraCallback(callback, extraCallback),
			});
			return;
		}

		if (!requisitionSlipsByBranch?.[branchId]) {
			getRequisitionSlipsByIdAndBranch({
				id,
				branchId,
				isForOutOfStock,
				callback: modifiedExtraCallback(callback, extraCallback),
			});
		} else {
			callback({ status: request.REQUESTING });
			callback({ status: request.SUCCESS });
		}
	};

	const getPendingCount = (data, extraCallback = null) => {
		setRecentRequest(types.GET_PENDING_COUNT);
		getPendingCountAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const createRequisitionSlipRequest = (data, extraCallback = null) => {
		setRecentRequest(types.CREATE_REQUISITION_SLIP);
		createRequisitionSlip({
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

	const editRequisitionSlipRequest = (id, action) => {
		setRecentRequest(types.EDIT_REQUISITION_SLIP);
		editRequisitionSlip({
			id,
			action,
			callback: modifiedCallback(
				callback,
				EDIT_SUCCESS_MESSAGE,
				EDIT_ERROR_MESSAGE,
			),
		});
	};

	const setOutOfStockRequest = (data) => {
		setRecentRequest(types.SET_OUT_OF_STOCK);
		setOutOfStock({
			...data,
			callback: modifiedCallback(
				callback,
				SET_OUT_OF_STOCK_SUCCESS_MESSAGE,
				SET_OUT_OF_STOCK_ERROR_MESSAGE,
			),
		});
	};

	return {
		requisitionSlip,
		requisitionSlipsByBranch,
		requisitionSlipForOutOfStock,

		requisitionSlips: currentPageData,
		pageCount,
		currentPage,
		pageSize,
		addItemInPagination,
		updateItemInPagination,
		removeItemInPagination,

		getRequisitionSlips,
		getRequisitionSlipsExtended,
		getRequisitionSlipsById,
		getRequisitionSlipsByIdAndBranch: getRequisitionSlipsByIdAndBranchRequest,
		getPendingCount,
		createRequisitionSlip: createRequisitionSlipRequest,
		editRequisitionSlip: editRequisitionSlipRequest,
		setOutOfStock: setOutOfStockRequest,
		removeRequisitionSlipByBranch,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
