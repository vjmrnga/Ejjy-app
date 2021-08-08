import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../../../ducks/order-slips';
import { request } from '../../../global/types';
import { useActionDispatch } from '../../../hooks/useActionDispatch';
import {
	modifiedCallback,
	modifiedExtraCallback,
} from '../../../utils/function';

const CREATE_SUCCESS_MESSAGE = 'Order slip was created successfully';
const CREATE_ERROR_MESSAGE = 'An error occurred while creating the order slip';

const EDIT_SUCCESS_MESSAGE = 'Order slip was edited successfully';
const EDIT_ERROR_MESSAGE = 'An error occurred while editing the order slip';

const REMOVE_SUCCESS_MESSAGE = 'Order slip was removed successfully';
const REMOVE_ERROR_MESSAGE = 'An error occurred while removing the order slip';

export const useOrderSlips = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const orderSlips = useSelector(selectors.selectOrderSlips());
	const getOrderSlipsAction = useActionDispatch(actions.getOrderSlips);
	const getOrderSlipsExtendedAction = useActionDispatch(
		actions.getOrderSlipsExtended,
	);
	const getPendingCountAction = useActionDispatch(actions.getPendingCount);
	const createOrderSlipAction = useActionDispatch(actions.createOrderSlip);
	const editOrderSlipAction = useActionDispatch(actions.editOrderSlip);
	const removeOrderSlipAction = useActionDispatch(actions.removeOrderSlip);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const getOrderSlip = (requisitionSlipId) => {
		setRecentRequest(types.GET_ORDER_SLIPS);
		getOrderSlipsAction({ requisition_slip_id: requisitionSlipId, callback });
	};

	const getOrderSlipsExtended = (requisitionSlipId) => {
		setRecentRequest(types.GET_ORDER_SLIPS_EXTENDED);
		getOrderSlipsExtendedAction({
			requisition_slip_id: requisitionSlipId,
			callback,
		});
	};

	const getPendingCount = (data, extraCallback = null) => {
		setRecentRequest(types.GET_PENDING_COUNT);
		getPendingCountAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const createOrderSlip = (orderSlip) => {
		setRecentRequest(types.CREATE_ORDER_SLIP);
		createOrderSlipAction({
			...orderSlip,
			callback: modifiedCallback(
				callback,
				CREATE_SUCCESS_MESSAGE,
				CREATE_ERROR_MESSAGE,
			),
		});
	};

	const editOrderSlip = (orderSlip) => {
		setRecentRequest(types.EDIT_ORDER_SLIP);
		editOrderSlipAction({
			...orderSlip,
			callback: modifiedCallback(
				callback,
				EDIT_SUCCESS_MESSAGE,
				EDIT_ERROR_MESSAGE,
			),
		});
	};

	const removeOrderSlip = (id) => {
		setRecentRequest(types.REMOVE_ORDER_SLIP);
		removeOrderSlipAction({
			id,
			callback: modifiedCallback(
				callback,
				REMOVE_SUCCESS_MESSAGE,
				REMOVE_ERROR_MESSAGE,
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
		orderSlips,
		getOrderSlip,
		getOrderSlipsExtended,
		getPendingCount,
		createOrderSlip,
		editOrderSlip,
		removeOrderSlip,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
