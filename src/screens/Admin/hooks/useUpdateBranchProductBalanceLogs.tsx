import { useState } from 'react';
import { actions } from '../../../ducks/Admin/update-branch-product-balance';
import { request } from '../../../global/types';
import { useActionDispatch } from '../../../hooks/useActionDispatch';
import { modifiedExtraCallback } from '../../../utils/function';

export const useUpdateBranchProductBalanceLogs = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	// ACTIONS
	const getUpdateBranchProductBalanceLogsAction = useActionDispatch(
		actions.getUpdateBranchProductBalanceLogs,
	);

	const getUpdateBranchProductBalanceLogs = (extraCallback = null) => {
		getUpdateBranchProductBalanceLogsAction({
			callback: modifiedExtraCallback(callback, extraCallback),
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
		getUpdateBranchProductBalanceLogs,
		status,
		errors,
	};
};
