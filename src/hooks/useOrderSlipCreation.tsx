/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/order-slip-creation';
import { request } from '../global/types';
import { modifiedExtraCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

export const useOrderSlipCreation = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();
	const [warnings, setWarnings] = useState<any>([]);

	// SELECTORS
	const orderSlipDetails = useSelector(selectors.selectOrderSlipDetails());

	// ACTIONS
	const getBranchProductsAction = useActionDispatch(actions.getBranchProducts);
	const getUsersAction = useActionDispatch(actions.getUsers);

	// GENERAL METHODS
	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const reset = () => {
		resetError();
		resetStatus();
	};

	// REQUEST METHODS
	const getBranchProducts = (data, extraCallback = null) => {
		setRecentRequest(types.GET_BRANCH_PRODUCTS);
		getBranchProductsAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const getUsers = (data, extraCallback = null) => {
		setRecentRequest(types.GET_USERS);
		getUsersAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const callback = ({ status, errors = [], warnings = [] }) => {
		setStatus(status);
		setErrors(errors);
		setWarnings(warnings);
	};

	return {
		orderSlipDetails,
		getBranchProducts,
		getUsers,
		status,
		errors,
		warnings,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
