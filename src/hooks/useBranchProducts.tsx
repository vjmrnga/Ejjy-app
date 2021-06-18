import { useEffect, useState } from 'react';
import { actions, types } from '../ducks/branch-products';
import { request } from '../global/types';
import { modifiedCallback, modifiedExtraCallback, onCallback } from '../utils/function';
import {
	executePaginatedRequest,
	getDataForCurrentPage,
	updateInCachedData,
} from '../utils/pagination';
import { useActionDispatch } from './useActionDispatch';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching products';

const EDIT_SUCCESS_MESSAGE = 'Branch product was edited successfully';
const EDIT_ERROR_MESSAGE = 'An error occurred while editing the branch product';

const EDIT_BALANCE_SUCCESS_MESSAGE = 'Branch product balance was edited successfully';
const EDIT_BALANCE_ERROR_MESSAGE = 'An error occurred while editing the branch product balance';

export const useBranchProducts = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();
	const [warnings, setWarnings] = useState<any>([]);

	// PAGINATION
	const [allData, setAllData] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageData, setCurrentPageData] = useState([]);
	const [pageSize, setPageSize] = useState(10);

	// ACTIONS

	const getBranchProductsAction = useActionDispatch(actions.getBranchProducts);
	const getBranchProductsByBranchAction = useActionDispatch(actions.getBranchProductsByBranch);
	const editBranchProductAction = useActionDispatch(actions.editBranchProduct);
	const editBranchProductBalanceAction = useActionDispatch(actions.editBranchProductBalance);
	const editBranchProductPriceCostAction = useActionDispatch(actions.editBranchProductPriceCost);

	// GENERAL METHODS
	const resetError = () => setErrors([]);

	const resetWarning = () => setWarnings([]);

	const resetStatus = () => setStatus(request.NONE);

	const reset = () => {
		resetError();
		resetStatus();
		resetWarning();
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
	}, [allData, currentPage, pageSize]);

	const updateItemInPagination = (item) => {
		setAllData((data) => updateInCachedData({ data, item }));
	};

	// REQUEST METHODS
	const getBranchProducts = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: getBranchProductsAction,
			requestType: types.GET_BRANCH_PRODUCTS,
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

	const getBranchProductsByBranch = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: getBranchProductsByBranchAction,
			requestType: types.GET_BRANCH_PRODUCTS_BY_BRANCH,
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

	const editBranchProduct = (branchProduct, extraCallback = null) => {
		setRecentRequest(types.EDIT_BRANCH_PRODUCT);
		editBranchProductAction({
			...branchProduct,
			allowable_spoilage: (branchProduct.allowable_spoilage || 0) / 100,
			callback: modifiedExtraCallback(
				modifiedCallback(callback, EDIT_SUCCESS_MESSAGE, EDIT_ERROR_MESSAGE),
				extraCallback,
			),
		});
	};

	const editBranchProductBalance = (data, extraCallback = null) => {
		setRecentRequest(types.EDIT_BRANCH_PRODUCT);
		editBranchProductBalanceAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(callback, EDIT_BALANCE_SUCCESS_MESSAGE, EDIT_BALANCE_ERROR_MESSAGE),
				extraCallback,
			),
		});
	};

	const editBranchProductPriceCost = (data, extraCallback = null) => {
		setRecentRequest(types.EDIT_BRANCH_PRODUCT);
		editBranchProductPriceCostAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const callback = ({ status, errors = [], warnings = [] }) => {
		setStatus(status);
		setErrors(errors);
		setWarnings(warnings);
	};

	return {
		branchProducts: currentPageData,
		pageCount,
		currentPage,
		pageSize,
		updateItemInPagination,

		getBranchProducts,
		getBranchProductsByBranch,
		editBranchProduct,
		editBranchProductBalance,
		editBranchProductPriceCost,
		status,
		errors,
		warnings,
		recentRequest,
		reset,
		resetStatus,
		resetError,
		resetAll,
	};
};
