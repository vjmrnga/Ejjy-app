import { useEffect, useState } from 'react';
import { actions, types } from '../ducks/OfficeManager/products';
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

const LIST_ERROR_MESSAGE = 'An error occurred while fetching products';

const CREATE_SUCCESS_MESSAGE = 'Product was created successfully';
const CREATE_ERROR_MESSAGE = 'An error occurred while creating the product';

const EDIT_SUCCESS_MESSAGE = 'Product was edited successfully';
const EDIT_ERROR_MESSAGE = 'An error occurred while editing the product';

const REMOVE_SUCCESS_MESSAGE = 'Product was removed successfully';
const REMOVE_ERROR_MESSAGE = 'An error occurred while removing the product';

export const useProducts = () => {
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
	const getProductsAction = useActionDispatch(actions.getProducts);
	const createProductAction = useActionDispatch(actions.createProduct);
	const editProductAction = useActionDispatch(actions.editProduct);
	const removeProductAction = useActionDispatch(actions.removeProduct);

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

	// REQUEST METHODS
	const getProducts = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: getProductsAction,
			requestType: types.CREATE_PRODUCT,
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

	const createProduct = (data, extraCallback = null) => {
		setRecentRequest(types.CREATE_PRODUCT);
		const clonedProduct = {
			...data,
			allowable_spoilage: (data.allowable_spoilage || 0) / 100,
		};

		createProductAction({
			...clonedProduct,
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

	const editProduct = (data, extraCallback = null) => {
		setRecentRequest(types.EDIT_PRODUCT);
		const clonedProduct = {
			...data,
			allowable_spoilage: (data.allowable_spoilage || 0) / 100,
		};

		editProductAction({
			...clonedProduct,
			callback: modifiedExtraCallback(
				modifiedCallback(callback, EDIT_SUCCESS_MESSAGE, EDIT_ERROR_MESSAGE),
				extraCallback,
			),
		});
	};

	const removeProduct = (data, extraCallback = null) => {
		setRecentRequest(types.REMOVE_PRODUCT);
		removeProductAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(
					callback,
					REMOVE_SUCCESS_MESSAGE,
					REMOVE_ERROR_MESSAGE,
				),
				extraCallback,
			),
		});
	};

	return {
		products: currentPageData,
		pageCount,
		currentPage,
		pageSize,
		addItemInPagination,
		updateItemInPagination,
		removeItemInPagination,

		getProducts,
		createProduct,
		editProduct,
		removeProduct,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
