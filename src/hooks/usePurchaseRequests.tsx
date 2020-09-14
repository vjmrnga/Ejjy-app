/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/purchase-requests';
import { request } from '../global/variables';
import { useActionDispatch } from './useActionDispatch';
import { modifiedCallback } from '../utils/function';
const CREATE_SUCCESS_MESSAGE = 'Purchase Request created successfully';
const CREATE_ERROR_MESSAGE = 'An error occurred while creating the branch';

export const usePurchaseRequests = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const purchaseRequests = useSelector(selectors.selectPurchaseRequests());
	const getPurchaseRequests = useActionDispatch(actions.getPurchaseRequests);
	const getPurchaseRequestsExtended = useActionDispatch(actions.getPurchaseRequestsExtended);
	const createPurchaseRequest = useActionDispatch(actions.createPurchaseRequest);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const getPurchaseRequestsRequest = (branchId = null) => {
		setRecentRequest(types.GET_PURCHASE_REQUESTS);
		getPurchaseRequests({ id: branchId, callback });
	};

	const getPurchaseRequestsExtendedRequest = (branchId = null) => {
		setRecentRequest(types.GET_PURCHASE_REQUESTS_EXTENDED);
		getPurchaseRequestsExtended({ id: branchId, callback });
	};

	const createPurchaseRequestRequest = (purchaseRequest) => {
		setRecentRequest(types.CREATE_PURCHASE_REQUEST);
		createPurchaseRequest({
			...purchaseRequest,
			callback: modifiedCallback(callback, CREATE_SUCCESS_MESSAGE, CREATE_ERROR_MESSAGE),
		});
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return {
		purchaseRequests,
		getPurchaseRequests: getPurchaseRequestsRequest,
		getPurchaseRequestsExtended: getPurchaseRequestsExtendedRequest,
		createPurchaseRequest: createPurchaseRequestRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
