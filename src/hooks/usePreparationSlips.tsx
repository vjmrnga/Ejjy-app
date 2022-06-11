import { useEffect, useState } from 'react';
import { actions, types } from '../ducks/preparation-slips';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';
import { modifiedCallback, modifiedExtraCallback, onCallback } from 'utils';
import {
	addInCachedData,
	executePaginatedRequest,
	getDataForCurrentPage,
	removeInCachedData,
	updateInCachedData,
} from '../utils/pagination';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching preparation slips';

const FULFILL_SUCCESS_MESSAGE = 'Preparation slip was fulfilled successfully';
const FULFILL_SAVE_SUCCESS_MESSAGE = 'Preparation slip was saved successfully';
const FULFILL_ERROR_MESSAGE =
	'An error occurred while fulfilling the preparation slip';

const APPROVE_OR_DISAPPROVE_SUCCESS_MESSAGE = 'Order slip was % successfully';
const APPROVE_OR_DISAPPROVE_ERROR_MESSAGE =
	'An error occurred while % the order slip';

export const usePreparationSlips = () => {
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
	const getPreparationSlipsAction = useActionDispatch(
		actions.getPreparationSlips,
	);
	const getPreparationSlipByIdAction = useActionDispatch(
		actions.getPreparationSlipById,
	);
	const fulfillPreparationSlipAction = useActionDispatch(
		actions.fulfillPreparationSlip,
	);

	const approveOrDisapprovePreparationSlipAction = useActionDispatch(
		actions.approveOrDisapprovePreparationSlip,
	);

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
	const getPreparationSlips = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: getPreparationSlipsAction,
			requestType: types.GET_PREPARATION_SLIPS,
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

	const getPreparationSlipById = (data, extraCallback = null) => {
		setRecentRequest(types.GET_PREPARATION_SLIP_BY_ID);
		getPreparationSlipByIdAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const fulfillPreparationSlip = (data, extraCallback = null) => {
		setRecentRequest(types.FULFILL_PREPARATION_SLIP);
		fulfillPreparationSlipAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(
					callback,
					data.is_prepared
						? FULFILL_SUCCESS_MESSAGE
						: FULFILL_SAVE_SUCCESS_MESSAGE,
					FULFILL_ERROR_MESSAGE,
				),
				extraCallback,
			),
		});
	};

	const approveOrDisapprovePreparationSlip = (data, extraCallback = null) => {
		const successMessage = data.isApproved ? 'approved' : 'disapproved';
		const failMessage = data.isApproved ? 'approving' : 'disapproving';

		setRecentRequest(types.FULFILL_PREPARATION_SLIP);
		approveOrDisapprovePreparationSlipAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(
					callback,
					APPROVE_OR_DISAPPROVE_SUCCESS_MESSAGE.replace('%', successMessage),
					APPROVE_OR_DISAPPROVE_ERROR_MESSAGE.replace('%', failMessage),
				),
				extraCallback,
			),
		});
	};

	return {
		preparationSlips: currentPageData,
		pageCount,
		currentPage,
		pageSize,
		addItemInPagination,
		updateItemInPagination,
		removeItemInPagination,

		getPreparationSlips,
		getPreparationSlipById,
		fulfillPreparationSlip,
		approveOrDisapprovePreparationSlip,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
