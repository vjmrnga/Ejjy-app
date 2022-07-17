import { useState } from 'react';
import { useSelector } from 'react-redux';
import { modifiedExtraCallback } from 'utils';
import {
	actions,
	selectors,
	types,
} from '../../../ducks/OfficeManager/delivery-receipt-products';
import { request } from '../../../global/types';
import { useActionDispatch } from '../../../hooks/useActionDispatch';

export const useDeliveryReceiptProducts = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const deliveryReceiptProduct = useSelector(
		selectors.selectDeliveryReceiptProduct(),
	);
	const getDeliveryReceiptProductById = useActionDispatch(
		actions.getDeliveryReceiptProductById,
	);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const getDeliveryReceiptProductByIdRequest = (id, extraCallback = null) => {
		setRecentRequest(types.GET_DELIVERY_RECEIPT_PRODUCT_BY_ID);
		getDeliveryReceiptProductById({
			id,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const callback = ({
		status: callbackStauts,
		errors: callbackErrors = [],
	}) => {
		setStatus(callbackStauts);
		setErrors(callbackErrors);
	};

	return {
		deliveryReceiptProduct,
		getDeliveryReceiptProductById: getDeliveryReceiptProductByIdRequest,
		status,
		errors,
		recentRequest,
		reset,
		resetStatus,
		resetError,
	};
};
