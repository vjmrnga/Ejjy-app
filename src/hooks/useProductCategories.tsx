import { useState } from 'react';
import { actions } from '../ducks/product-categories';
import { request } from '../global/types';
import { modifiedCallback, modifiedExtraCallback } from 'utils';
import { useActionDispatch } from './useActionDispatch';

const CREATE_SUCCESS_MESSAGE = 'Product category was created successfully';
const CREATE_ERROR_MESSAGE =
	'An error occurred while creating the product category';

const EDIT_SUCCESS_MESSAGE = 'Product category was edited successfully';
const EDIT_ERROR_MESSAGE =
	'An error occurred while editing the product category';

const REMOVE_SUCCESS_MESSAGE = 'Product category was removed successfully';
const REMOVE_ERROR_MESSAGE =
	'An error occurred while removing the product category';

export const useProductCategories = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);

	const getProductCategoriesAction = useActionDispatch(
		actions.getProductCategories,
	);
	const createProductCategoryAction = useActionDispatch(
		actions.createProductCategory,
	);
	const editProductCategoryAction = useActionDispatch(
		actions.editProductCategory,
	);
	const removeProductCategoryAction = useActionDispatch(
		actions.removeProductCategory,
	);

	const resetError = () => setErrors([]);

	const resetStatus = () => setStatus(request.NONE);

	const reset = () => {
		resetError();
		resetStatus();
	};

	const callback = ({
		status: callbackStatus,
		errors: callbackErrors = [],
	}) => {
		setStatus(callbackStatus);
		setErrors(callbackErrors);
	};

	const getProductCategories = (data, extraCallback = null) => {
		getProductCategoriesAction({
			...data,
			callback: modifiedExtraCallback(callback, extraCallback),
		});
	};

	const createProductCategory = (data, extraCallback = null) => {
		createProductCategoryAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(
					callback,
					CREATE_SUCCESS_MESSAGE,
					CREATE_ERROR_MESSAGE,
				),
				extraCallback,
			),
		});
	};

	const editProductCategory = (data, extraCallback = null) => {
		editProductCategoryAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(callback, EDIT_SUCCESS_MESSAGE, EDIT_ERROR_MESSAGE),
				extraCallback,
			),
		});
	};

	const removeProductCategory = (data, extraCallback = null) => {
		removeProductCategoryAction({
			...data,
			callback: modifiedExtraCallback(
				modifiedCallback(
					callback,
					REMOVE_SUCCESS_MESSAGE,
					REMOVE_ERROR_MESSAGE,
				),
				extraCallback,
			),
		});
	};

	return {
		getProductCategories,
		createProductCategory,
		editProductCategory,
		removeProductCategory,
		status,
		errors,
		reset,
		resetStatus,
		resetError,
	};
};
