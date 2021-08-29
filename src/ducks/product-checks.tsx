import { createAction } from 'redux-actions';

export const key = 'BM_PRODUCT_CHECKS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_PRODUCT_CHECKS: `${key}/GET_PRODUCTS_CHECKS`,
	GET_PRODUCT_CHECK: `${key}/GET_PRODUCTS_CHECK`,
	GET_PRODUCT_CHECK_DAILY: `${key}/GET_PRODUCT_CHECK_DAILY`,
	FULFILL_PRODUCT_CHECK: `${key}/FULFILL_PRODUCT_CHECK`,
};

export const actions = {
	save: createAction(types.SAVE),
	getProductChecks: createAction(types.GET_PRODUCT_CHECKS),
	getProductCheck: createAction(types.GET_PRODUCT_CHECK),
	getProductCheckDaily: createAction(types.GET_PRODUCT_CHECK_DAILY),
	fulfillProductCheck: createAction(types.FULFILL_PRODUCT_CHECK),
};
