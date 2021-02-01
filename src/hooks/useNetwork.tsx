import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/network';
import { request } from '../global/types';
import { useActionDispatch } from './useActionDispatch';

export const useNetwork = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const hasInternetConnection = useSelector(selectors.selectHasInternetConnection());
	const testConnection = useActionDispatch(actions.testConnection);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const testConnectionRequest = () => {
		setRecentRequest(types.TEST_CONNECTION);
		testConnection();
	};

	return {
		hasInternetConnection,
		testConnection: testConnectionRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
