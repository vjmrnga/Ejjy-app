import { useState } from 'react';
import { useSelector } from 'react-redux';
import { modifiedExtraCallback } from 'utils';
import { actions, selectors } from '../ducks/network';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';

export const useNetwork = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	// SELECTORS
	const hasInternetConnection = useSelector(
		selectors.selectHasInternetConnection(),
	);

	// ACTIONS
	const testConnectionAction = useActionDispatch(actions.testConnection);
	const testBranchConnectionAction = useActionDispatch(
		actions.testBranchConnection,
	);

	const callback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
	};

	// METHODS
	const testConnection = () => {
		testConnectionAction();
	};

	const testBranchConnection = (data, extraCallback = null) => {
		testBranchConnectionAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	return {
		hasInternetConnection,
		testConnection,
		testBranchConnection,
		status,
		errors,
	};
};
