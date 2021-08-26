import { useState } from 'react';
import { actions } from '../../../ducks/BranchManager/product-checks';
import { request } from '../../../global/types';
import { useActionDispatch } from '../../../hooks/useActionDispatch';
import {
	modifiedCallback,
	modifiedExtraCallback,
} from '../../../utils/function';

const FULFILL_PRODUCT_CHECK_SUCCESS_MESSAGE =
	'Product check was fulfilled successfully';
const FULFILL_PRODUCT_CHECK_ERROR_MESSAGE =
	'An error occurred while fulfilling the product checks';

export const useProductChecks = () => {
	// STATES
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	// ACTIONS
	const getProductChecksAction = useActionDispatch(actions.getProductChecks);
	const fulfillProductCheckAction = useActionDispatch(
		actions.fulfillProductCheck,
	);

	// METHODS
	const getProductChecks = (data, extraCallback = null) => {
		getProductChecksAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const fulfillProductCheck = (data, extraCallback = null) => {
		fulfillProductCheckAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(
					callback,
					FULFILL_PRODUCT_CHECK_SUCCESS_MESSAGE,
					FULFILL_PRODUCT_CHECK_ERROR_MESSAGE,
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
		getProductChecks,
		fulfillProductCheck,
		status,
		errors,
	};
};
