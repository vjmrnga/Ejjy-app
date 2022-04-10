import { actions } from 'ducks/back-orders';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE, request } from 'global';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { BackOrdersService, ONLINE_API_URL } from 'services';
import {
	getLocalIpAddress,
	modifiedCallback,
	modifiedExtraCallback,
	onCallback,
} from 'utils/function';
import {
	addInCachedData,
	executePaginatedRequest,
	getDataForCurrentPage,
	removeInCachedData,
	updateInCachedData,
} from 'utils/pagination';
import { Query } from './inteface';
import { useActionDispatch } from './useActionDispatch';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching back orders';

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

		retrieveBackOrder,
		editBackOrder,
		receiveBackOrder,
		status,
		errors,
	};
};

const useBackOrdersNew = ({ params }: Query) =>
	useQuery<any>(
		['useBackOrders', params?.page, params?.pageSize, params?.type],
		async () =>
			BackOrdersService.list(
				{
					page: params?.page || DEFAULT_PAGE,
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					type: params?.type,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				backOrders: query.data.results,
				total: query.data.count,
			}),
		},
	);

export const useBackOrderRetrieve = ({ id, options }: Query) =>
	useQuery<any>(
		['useBackOrderRetrieve', id],
		async () =>
			BackOrdersService.retrieve(
				id,
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
			select: (query) => query.data,
			...options,
		},
	);

export const useBackOrderCreate = () =>
	useMutation<any, any, any>(
		({ encodedById, overallRemarks, products, senderId, type }: any) =>
			BackOrdersService.create(
				{
					is_online: IS_APP_LIVE,
					overall_remarks: overallRemarks,
					products,
					sender_id: senderId,
					encoded_by_id: encodedById,
					type,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
	);

export default useBackOrdersNew;
