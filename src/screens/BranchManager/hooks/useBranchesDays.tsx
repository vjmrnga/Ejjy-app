import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../../../ducks/BranchManager/branches-days';
import { request } from '../../../global/types';
import { useActionDispatch } from '../../../hooks/useActionDispatch';

export const useBranchesDays = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const branchDay = useSelector(selectors.selectBranchDay());
	const getBranchDay = useActionDispatch(actions.getBranchDay);
	const createBranchDay = useActionDispatch(actions.createBranchDay);
	const editBranchDay = useActionDispatch(actions.editBranchDay);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const getBranchDayRequest = (branchId) => {
		setRecentRequest(types.GET_BRANCH_DAY);
		getBranchDay({
			branch_id: branchId,
			callback,
		});
	};

	const createBranchDayRequest = (branchId, startedById) => {
		setRecentRequest(types.CREATE_BRANCH_DAY);
		createBranchDay({
			branch_id: branchId,
			started_by_id: startedById,
			callback,
		});
	};

	const editBranchDayRequest = (branchDayId, endedById) => {
		setRecentRequest(types.EDIT_BRANCH_DAY);
		editBranchDay({
			id: branchDayId,
			ended_by_id: endedById,
			callback,
		});
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		branchDay,
		getBranchDay: getBranchDayRequest,
		createBranchDay: createBranchDayRequest,
		editBranchDay: editBranchDayRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
