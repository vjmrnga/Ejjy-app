/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { actions, selectors, types } from '../ducks/branch-products';
import { request } from '../global/variables';
import { modifiedCallback } from '../utils/function';
import { useActionDispatch } from './useActionDispatch';

const CREATE_SUCCESS_MESSAGE = 'Branch Product created successfully';
const CREATE_ERROR_MESSAGE = 'An error occurred while creating the branch';

const EDIT_SUCCESS_MESSAGE = 'Branch Product edited successfully';
const EDIT_ERROR_MESSAGE = 'An error occurred while editing the branch';

const REMOVE_SUCCESS_MESSAGE = 'Branch Product removed successfully';
const REMOVE_ERROR_MESSAGE = 'An error occurred while removing the branch';

export const useBranchProducts = () => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();

	const branchProducts = useSelector(selectors.selectBranchProducts());
	const getBranchProducts = useActionDispatch(actions.getBranchProducts);
	const createBranchProduct = useActionDispatch(actions.createBranchProduct);
	const editBranchProduct = useActionDispatch(actions.editBranchProduct);
	const removeBranchProduct = useActionDispatch(actions.removeBranchProduct);

	const getBranchProductsRequest = () => {
		setRecentRequest(types.GET_BRANCH_PRODUCTS);
		getBranchProducts({ callback });
	};

	const createBranchProductRequest = (branchProduct) => {
		setRecentRequest(types.CREATE_BRANCH_PRODUCT);
		createBranchProduct({
			...branchProduct,
			callback: modifiedCallback(callback, CREATE_SUCCESS_MESSAGE, CREATE_ERROR_MESSAGE),
		});
	};

	const editBranchProductRequest = (branchProduct) => {
		setRecentRequest(types.EDIT_BRANCH_PRODUCT);
		editBranchProduct({
			...branchProduct,
			callback: modifiedCallback(callback, EDIT_SUCCESS_MESSAGE, EDIT_ERROR_MESSAGE),
		});
	};

	const removeBranchProductRequest = (id) => {
		setRecentRequest(types.REMOVE_BRANCH_PRODUCT);
		removeBranchProduct({
			id,
			callback: modifiedCallback(callback, REMOVE_SUCCESS_MESSAGE, REMOVE_ERROR_MESSAGE),
		});
	};

	const callback = ({ status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);
	};

	return [
		branchProducts,
		createBranchProductRequest,
		editBranchProductRequest,
		removeBranchProductRequest,
		status,
		errors,
		recentRequest,
	];
};
