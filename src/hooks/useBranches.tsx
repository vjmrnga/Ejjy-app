import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, IS_APP_LIVE } from 'global';
import { Query } from 'hooks/inteface';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { BranchesService } from 'services';
import { getLocalApiUrl, getOnlineApiUrl, modifiedCallback } from 'utils';
import { actions, selectors, types } from '../ducks/OfficeManager/branches';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';

const CREATE_SUCCESS_MESSAGE = 'Branch was created successfully';
const CREATE_ERROR_MESSAGE = 'An error occurred while creating the branch';

const EDIT_SUCCESS_MESSAGE = 'Branch was edited successfully';
const EDIT_ERROR_MESSAGE = 'An error occurred while editing the branch';

const REMOVE_SUCCESS_MESSAGE = 'Branch was removed successfully';
const REMOVE_ERROR_MESSAGE = 'An error occurred while removing the branch';

export const useBranches = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const branch = useSelector(selectors.selectBranch());
	const branches = useSelector(selectors.selectBranches());

	const getBranchAction = useActionDispatch(actions.getBranch);
	const getBranchesAction = useActionDispatch(actions.getBranches);
	const createBranchAction = useActionDispatch(actions.createBranch);
	const editBranchAction = useActionDispatch(actions.editBranch);
	const removeBranchAction = useActionDispatch(actions.removeBranch);

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const callback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
	};

	const getBranches = () => {
		setRecentRequest(types.GET_BRANCHES);
		getBranchesAction({ callback });
	};

	const getBranch = (branchId) => {
		setRecentRequest(types.GET_BRANCH);
		getBranchAction({
			id: branchId,
			callback,
		});
	};

	const createBranch = (branchData) => {
		setRecentRequest(types.CREATE_BRANCH);
		createBranchAction({
			...branchData,
			callback: modifiedCallback(
				callback,
				CREATE_SUCCESS_MESSAGE,
				CREATE_ERROR_MESSAGE,
			),
		});
	};

	const editBranch = (branchData) => {
		setRecentRequest(types.EDIT_BRANCH);
		editBranchAction({
			...branchData,
			callback: modifiedCallback(
				callback,
				EDIT_SUCCESS_MESSAGE,
				EDIT_ERROR_MESSAGE,
			),
		});
	};

	const removeBranch = (branchId) => {
		setRecentRequest(types.REMOVE_BRANCH);
		removeBranchAction({
			id: branchId,
			callback: modifiedCallback(
				callback,
				REMOVE_SUCCESS_MESSAGE,
				REMOVE_ERROR_MESSAGE,
			),
		});
	};

	return {
		branch,
		branches,
		getBranch,
		getBranches,
		createBranch,
		editBranch,
		removeBranch,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};

const useBranchesNew = ({ params }: Query) =>
	useQuery<any>(
		['useBranches', params?.baseURL, params?.page, params?.pageSize],
		async () =>
			BranchesService.list(
				{
					page_size: params?.pageSize || DEFAULT_PAGE_SIZE,
					page: params?.page || DEFAULT_PAGE,
				},
				params?.baseURL || (IS_APP_LIVE ? getOnlineApiUrl() : getLocalApiUrl()),
			).catch((e) => Promise.reject(e.errors)),
		{
			initialData: { data: { results: [], count: 0 } },
			select: (query) => ({
				branches: query.data.results,
				total: query.data.count,
			}),
		},
	);

export default useBranchesNew;
