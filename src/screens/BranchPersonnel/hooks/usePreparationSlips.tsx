import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../../../ducks/BranchPersonnel/preparation-slips';
import { request } from '../../../global/types';
import { useActionDispatch } from '../../../hooks/useActionDispatch';
import { modifiedCallback } from '../../../utils/function';

const CREATE_SUCCESS_MESSAGE = 'Preparation slip created successfully';
const CREATE_ERROR_MESSAGE = 'An error occurred while creating the preparation slip';

const EDIT_SUCCESS_MESSAGE = 'Preparation slip edited successfully';
const EDIT_ERROR_MESSAGE = 'An error occurred while editing the preparation slip';

export const usePreparationSlips = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const preparationSlips = useSelector(selectors.selectPreparationSlips());
	const getPreparationSlips = useActionDispatch(actions.getPreparationSlips);
	const getPreparationSlipsExtended = useActionDispatch(actions.getPreparationSlipsExtended);
	const createPreparationSlip = useActionDispatch(actions.createPreparationSlip);
	const editPreparationSlip = useActionDispatch(actions.editPreparationSlip);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const getPreparationSlipsRequest = () => {
		setRecentRequest(types.GET_PREPARATION_SLIPS);
		getPreparationSlips({ callback });
	};

	const getPreparationSlipsExtendedRequest = () => {
		setRecentRequest(types.GET_PREPARATION_SLIPS_EXTENDED);
		getPreparationSlipsExtended({ callback });
	};

	const createPreparationSlipRequest = (branch) => {
		setRecentRequest(types.CREATE_PREPARATION_SLIP);
		createPreparationSlip({
			...branch,
			callback: modifiedCallback(callback, CREATE_SUCCESS_MESSAGE, CREATE_ERROR_MESSAGE),
		});
	};

	const editPreparationSlipRequest = (branch) => {
		setRecentRequest(types.EDIT_PREPARATION_SLIP);
		editPreparationSlip({
			...branch,
			callback: modifiedCallback(callback, EDIT_SUCCESS_MESSAGE, EDIT_ERROR_MESSAGE),
		});
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		preparationSlips,
		getPreparationSlips: getPreparationSlipsRequest,
		getPreparationSlipsExtended: getPreparationSlipsExtendedRequest,
		createPreparationSlip: createPreparationSlipRequest,
		editPreparationSlip: editPreparationSlipRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
