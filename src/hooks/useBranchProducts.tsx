import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BranchProductsService, ONLINE_API_URL } from 'services';
import { actions, types } from '../ducks/branch-products';
import { request } from '../global/types';
import {
	getLocalIpAddress,
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

const useBranchProductsNew = ({ params }: Query) =>
	useQuery<any>(
		[
			'useBranchProducts',
			params?.hasBoBalance,
			params?.hasNegativeBalance,
			params?.isSoldInBranch,
			params?.page,
			params?.pageSize,
			params?.productCategory,
			params?.productIds,
			params?.productStatus,
			params?.search,
			params?.serverUrl,
		],
		async () => {
			let baseURL = params?.serverUrl;
			if (!baseURL) {
				baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
			}

			const data = {
				has_bo_balance: params?.hasBoBalance,
				has_negative_balance: params?.hasNegativeBalance,
				is_sold_in_branch: params?.isSoldInBranch,
				ordering: '-product__textcode',
				page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
				page: params?.page || DEFAULT_PAGE,
				product_category: params?.productCategory,
				product_ids: params?.productIds,
				product_status: params?.productStatus,
				search: params?.search,
			};

			try {
				// NOTE: Fetch in branch url
				return await BranchProductsService.list(data, baseURL);
			} catch (e) {
				// NOTE: Retry to fetch in local url
				baseURL = IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress();
				const response = await BranchProductsService.list(data, baseURL);
				response.data.warning =
					'Data Source: Backup Server, data might be outdated.';

				return response;
			}
		},
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				branchProducts: query.data.results,
				total: query.data.count,
				warning: query.data.warning,
			}),
		},
	);

export const useBranchProductRetrieve = ({ id, options }: Query) =>
	useQuery<any>(
		['useBranchProductRetrieve', id],
		async () =>
			BranchProductsService.list(
				{ product_ids: id },
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => query.data.results?.[0],
			...options,
		},
	);

export const useBranchProductEdit = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({
			id,
			allowableSpoilage,
			assignedPersonnelId,
			costPerBulk,
			costPerPiece,
			creditPricePerBulk,
			creditPricePerPiece,
			currentBalance,
			isDailyChecked,
			isRandomlyChecked,
			isSoldInBranch,
			markdownPricePerBulk1,
			markdownPricePerBulk2,
			markdownPricePerPiece1,
			markdownPricePerPiece2,
			maxBalance,
			pricePerBulk,
			pricePerPiece,
			reorderPoint,
		}: any) =>
			BranchProductsService.edit(
				id,
				{
					allowable_spoilage: allowableSpoilage,
					assigned_personnel_id: assignedPersonnelId,
					cost_per_bulk: costPerBulk,
					cost_per_piece: costPerPiece,
					credit_price_per_bulk: creditPricePerBulk,
					credit_price_per_piece: creditPricePerPiece,
					current_balance: currentBalance,
					is_daily_checked: isDailyChecked,
					is_randomly_checked: isRandomlyChecked,
					is_sold_in_branch: isSoldInBranch,
					markdown_price_per_bulk1: markdownPricePerBulk1,
					markdown_price_per_bulk2: markdownPricePerBulk2,
					markdown_price_per_piece1: markdownPricePerPiece1,
					markdown_price_per_piece2: markdownPricePerPiece2,
					max_balance: maxBalance,
					price_per_bulk: pricePerBulk,
					price_per_piece: pricePerPiece,
					reorder_point: reorderPoint,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranchProductRetrieve');
			},
		},
	);
};

export const useBranchProductEditPriceCost = () => {
	const queryClient = useQueryClient();

	return useMutation<any, any, any>(
		({
			productId,
			costPerPiece,
			costPerBulk,
			pricePerPiece,
			pricePerBulk,
		}: any) =>
			BranchProductsService.editPriceCost(
				{
					product_id: productId,
					cost_per_piece: costPerPiece,
					cost_per_bulk: costPerBulk,
					price_per_piece: pricePerPiece,
					price_per_bulk: pricePerBulk,
				},
				IS_APP_LIVE ? ONLINE_API_URL : getLocalIpAddress(),
			),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('useBranchProductRetrieve');
			},
		},
	);
};

export default useBranchProductsNew;
