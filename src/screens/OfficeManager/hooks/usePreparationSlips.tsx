import { useEffect, useState } from 'react';
import { actions } from '../../../ducks/OfficeManager/preparation-slips';
import { request } from '../../../global/types';
import { useActionDispatch } from '../../../hooks/useActionDispatch';
import { modifiedExtraCallback, onCallback } from '../../../utils/function';
import {
	executePaginatedRequest,
	getDataForCurrentPage,
} from '../../../utils/pagination';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching preparation slips';

export const usePreparationSlips = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [, setRecentRequest] = useState<any>();

	// PAGINATION
	const [allData, setAllData] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageData, setCurrentPageData] = useState([]);
	const [pageSize, setPageSize] = useState(10);

	// ACTIONS
	const listAction = useActionDispatch(actions.list);
	const retrieveAction = useActionDispatch(actions.retrieve);

	// GENERAL METHODS
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

	// REQUEST METHODS
	const list = (data, shouldReset = false) => {
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

	const retrieve = (data, extraCallback = null) => {
		retrieveAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	return {
		preparationSlips: currentPageData,
		pageCount,
		currentPage,
		pageSize,

		list,
		retrieve,
		status,
		errors,
	};
};
