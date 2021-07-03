import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/network';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';

export const useNetwork = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const hasInternetConnection = useSelector(
		selectors.selectHasInternetConnection(),
	);
	const testConnectionAction = useActionDispatch(actions.testConnection);

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const testConnection = () => {
		setRecentRequest(types.TEST_CONNECTION);
		testConnectionAction();
	};

	return {
		hasInternetConnection,
		testConnection,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
