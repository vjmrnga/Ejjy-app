import { useEffect, useState } from 'react';
import { actions, types } from '../ducks/branch-products';
import { request } from '../global/types';
import {
	modifiedCallback,
	modifiedExtraCallback,
	onCallback,
} from '../utils/function';
import {
	executePaginatedRequest,
	getDataForCurrentPage,
	updateInCachedData,
} from '../utils/pagination';
import { useActionDispatch } from './useActionDispatch';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching products';

const EDIT_SUCCESS_MESSAGE = 'Branch product was edited successfully';
const EDIT_ERROR_MESSAGE = 'An error occurred while editing the branch product';

const EDIT_BALANCE_SUCCESS_MESSAGE =
	'Branch product balance was edited successfully';
const EDIT_BALANCE_ERROR_MESSAGE =
	'An error occurred while editing the branch product balance';

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
	const getBranchProductsWithAnalyticsAction = useActionDispatch(
		actions.getBranchProductsWithAnalytics,
	);
	const getBranchProductAction = useActionDispatch(actions.getBranchProduct);
	const editBranchProductAction = useActionDispatch(actions.editBranchProduct);
	const editBranchProductBalanceAction = useActionDispatch(
		actions.editBranchProductBalance,
	);
	const editBranchProductPriceCostAction = useActionDispatch(
		actions.editBranchProductPriceCost,
	);

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
		});
	};

	const getBranchProductsWithAnalytics = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: getBranchProductsWithAnalyticsAction,
			requestType: types.GET_BRANCH_PRODUCTS_WITH_ANALYTICS,
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

	const getBranchProduct = (data, extraCallback = null) => {
		getBranchProductAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const editBranchProduct = (branchProduct, extraCallback = null) => {
		setRecentRequest(types.EDIT_BRANCH_PRODUCT);
		editBranchProductAction({
			...branchProduct,
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
				modifiedCallback(
					callback,
					EDIT_BALANCE_SUCCESS_MESSAGE,
					EDIT_BALANCE_ERROR_MESSAGE,
				),
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

	return {
		branchProducts: currentPageData,
		pageCount,
		currentPage,
		pageSize,
		updateItemInPagination,

		getBranchProducts,
		getBranchProductsWithAnalytics,
		getBranchProduct,
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
