import { useEffect, useState } from 'react';
import { actions, types } from '../ducks/OfficeManager/products';
import { request } from '../global/types';
import { useActionDispatch } from '../hooks/useActionDispatch';
import { modifiedCallback, modifiedExtraCallback, onCallback } from '../utils/function';
import {
	addInCachedData,
	executePaginatedRequest,
	getDataForCurrentPage,
	removeInCachedData,
	updateInCachedData,
} from '../utils/pagination';

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
			resetPagination,
		});
	};

	const createProduct = (product, extraCallback = null) => {
		setRecentRequest(types.CREATE_PRODUCT);
		const clonedProduct = {
			...product,
			allowable_spoilage: (product.allowable_spoilage || 0) / 100,
		};

		createProductAction({
			...clonedProduct,
			callback: modifiedExtraCallback(
				modifiedCallback(callback, CREATE_SUCCESS_MESSAGE, CREATE_ERROR_MESSAGE),
				extraCallback,
			),
		});
	};

	const editProduct = (product, extraCallback = null) => {
		setRecentRequest(types.EDIT_PRODUCT);
		const clonedProduct = {
			...product,
			allowable_spoilage: (product.allowable_spoilage || 0) / 100,
		};

		editProductAction({
			...clonedProduct,
			callback: modifiedExtraCallback(
				modifiedCallback(callback, EDIT_SUCCESS_MESSAGE, EDIT_ERROR_MESSAGE),
				extraCallback,
			),
		});
	};

	const removeProduct = (id, extraCallback = null) => {
		setRecentRequest(types.REMOVE_PRODUCT);
		removeProductAction({
			id,
			callback: modifiedExtraCallback(
				modifiedCallback(callback, REMOVE_SUCCESS_MESSAGE, REMOVE_ERROR_MESSAGE),
				extraCallback,
			),
		});
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
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
