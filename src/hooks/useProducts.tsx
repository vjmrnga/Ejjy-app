/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { productTypes, request } from '../global/variables';
import { modifiedCallback } from '../utils/function';
import { types } from '../ducks/products';

const CREATE_SUCCESS_MESSAGE = 'Product created successfully';
const CREATE_ERROR_MESSAGE = 'An error occurred while creating the product';

const EDIT_SUCCESS_MESSAGE = 'Product edited successfully';
const EDIT_ERROR_MESSAGE = 'An error occurred while editing the product';

const REMOVE_SUCCESS_MESSAGE = 'Product removed successfully';
const REMOVE_ERROR_MESSAGE = 'An error occurred while removing the product';

export const useProducts = (listDispatch, createDispatch, editDispatch, removeDispatch) => {
	const [status, setStatus] = useState<any>(request.NONE);
	const [errors, setErrors] = useState<any>([]);
	const [recentRequest, setRecentRequest] = useState<any>();
	const [products, setProducts] = useState<any>([]);

	useEffect(() => {
		getProducts();
	}, []);

	const getProducts = () => {
		setRecentRequest(types.GET_PRODUCTS);
		listDispatch({ callback });
	};

	const createProductRequest = (product) => {
		setRecentRequest(types.CREATE_PRODUCT);
		product.allowable_spoilage =
			product?.type === productTypes.WET ? product.allowable_spoilage / 100 : undefined;

		createDispatch({
			...product,
			callback: modifiedCallback(callback, CREATE_SUCCESS_MESSAGE, CREATE_ERROR_MESSAGE),
		});
	};

	const editProductRequest = (product) => {
		setRecentRequest(types.EDIT_PRODUCT);
		product.allowable_spoilage =
			product?.type === productTypes.WET ? product.allowable_spoilage / 100 : undefined;

		editDispatch({
			...product,
			callback: modifiedCallback(callback, EDIT_SUCCESS_MESSAGE, EDIT_ERROR_MESSAGE),
		});
	};

	const removeProductRequest = (id) => {
		setRecentRequest(types.REMOVE_PRODUCT);
		removeDispatch({
			id,
			callback: modifiedCallback(callback, REMOVE_SUCCESS_MESSAGE, REMOVE_ERROR_MESSAGE),
		});
	};

	const callback = ({ products = null, status, errors = [] }) => {
		setStatus(status);
		setErrors(errors);

		if (products !== null) {
			setProducts(products);
		}
	};

	return [
		products,
		getProducts,
		createProductRequest,
		editProductRequest,
		removeProductRequest,
		status,
		errors,
		recentRequest,
	];
};
