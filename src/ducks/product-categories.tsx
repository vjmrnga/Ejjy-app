import { createAction } from 'redux-actions';

export const key = 'PRODUCT_CATEGORY';

export const types = {
	GET_PRODUCT_CATEGORIES: `${key}/GET_PRODUCT_CATEGORIES`,
	CREATE_PRODUCT_CATEGORY: `${key}/CREATE_PRODUCT_CATEGORY`,
	EDIT_PRODUCT_CATEGORY: `${key}/EDIT_PRODUCT_CATEGORY`,
	REMOVE_PRODUCT_CATEGORY: `${key}/REMOVE_PRODUCT_CATEGORY`,
};

export const actions = {
	getProductCategories: createAction(types.GET_PRODUCT_CATEGORIES),
	createProductCategory: createAction(types.CREATE_PRODUCT_CATEGORY),
	editProductCategory: createAction(types.EDIT_PRODUCT_CATEGORY),
	removeProductCategory: createAction(types.REMOVE_PRODUCT_CATEGORY),
};
