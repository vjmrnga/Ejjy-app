import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
	actions,
	selectors,
	types,
} from '../../../ducks/BranchPersonnel/preparation-slips';
import { request } from '../../../global/types';
import { useActionDispatch } from '../../../hooks/useActionDispatch';
import {
	modifiedCallback,
	modifiedExtraCallback,
} from '../../../utils/function';

const FULFILL_SUCCESS_MESSAGE = 'Preparation slip was fulfilled successfully';
const FULFILL_SAVE_SUCCESS_MESSAGE = 'Preparation slip was saved successfully';
const FULFILL_ERROR_MESSAGE =
	'An error occurred while fulfilling the preparation slip';

export const usePreparationSlips = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	// SELECTORS
	const preparationSlips = useSelector(selectors.selectPreparationSlips());

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

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const getPreparationSlips = (assigned_personnel_id) => {
		setRecentRequest(types.GET_PREPARATION_SLIPS);
		getPreparationSlipsAction({ assigned_personnel_id, callback });
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

	const callback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
	};

	return {
		preparationSlips,
		getPreparationSlips,
		getPreparationSlipById,
		fulfillPreparationSlip,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
