import { useEffect, useState } from 'react';
import { actions, types } from '../../../ducks/product-checks';
import { request } from '../../../global/types';
import { useActionDispatch } from '../../../hooks/useActionDispatch';
import {
	modifiedCallback,
	modifiedExtraCallback,
	onCallback,
} from '../../../utils/function';
import {
	addInCachedData,
	executePaginatedRequest,
	getDataForCurrentPage,
	removeInCachedData,
	updateInCachedData,
} from '../../../utils/pagination';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching products';

const FULFILL_PRODUCT_CHECK_SUCCESS_MESSAGE =
	'Product check was fulfilled successfully';
const FULFILL_PRODUCT_CHECK_ERROR_MESSAGE =
	'An error occurred while fulfilling the product checks';

export const useProductChecks = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	// PAGINATION
	const [allData, setAllData] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageData, setCurrentPageData] = useState([]);
	const [pageSize, setPageSize] = useState(10);

	// ACTIONS
	const getProductChecksAction = useActionDispatch(actions.getProductChecks);
	const getProductCheckAction = useActionDispatch(actions.getProductCheck);
	const getProductCheckDailyAction = useActionDispatch(
		actions.getProductCheckDaily,
	);
	const fulfillProductCheckAction = useActionDispatch(
		actions.fulfillProductCheck,
	);

	// GENERAL METHODS
	// eslint-disable-next-line no-unused-vars
	const executeRequest = (data, requestCallback, action, _type) => {
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
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
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

	// METHODS
	const getProductChecks = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: getProductChecksAction,
			requestType: types.GET_PRODUCT_CHECKS,
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

	const getProductCheckDaily = (data, extraCallback = null) => {
		getProductCheckDailyAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const getProductCheck = (data, extraCallback = null) => {
		getProductCheckAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const fulfillProductCheck = (data, extraCallback = null) => {
		fulfillProductCheckAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(
					callback,
					FULFILL_PRODUCT_CHECK_SUCCESS_MESSAGE,
					FULFILL_PRODUCT_CHECK_ERROR_MESSAGE,
				),
				extraCallback,
			),
		});
	};

	return {
		pageCount,
		currentPage,
		pageSize,
		addItemInPagination,
		updateItemInPagination,
		removeItemInPagination,

		productChecks: currentPageData,
		getProductChecks,
		getProductCheck,
		getProductCheckDaily,
		fulfillProductCheck,
		status,
		errors,
	};
};
