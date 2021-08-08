import { useEffect, useState } from 'react';
import { actions, types } from '../ducks/Admin/logs';
import { request } from '../global/types';
import { modifiedExtraCallback, onCallback } from '../utils/function';
import {
	executePaginatedRequest,
	getDataForCurrentPage,
} from '../utils/pagination';
import { useActionDispatch } from './useActionDispatch';

const LIST_ERROR_MESSAGE = 'An error occurred while fetching logs';

export const useLogs = () => {
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
	const listLogsAction = useActionDispatch(actions.listLogs);
	const getCountAction = useActionDispatch(actions.getCount);

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
	}, [allData, currentPage]);

	// REQUEST METHODS
	const listLogs = (data, shouldReset = false) => {
		executePaginatedRequest(data, shouldReset, {
			requestAction: listLogsAction,
			requestType: types.LIST_LOGS,
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

	const getLogsCount = (extraCallback = null) => {
		getCountAction({
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	return {
		logs: currentPageData,
		pageCount,
		currentPage,
		pageSize,

		listLogs,
		getLogsCount,
		status,
		errors,
	};
};
