import { createAction } from 'redux-actions';

export const key = 'BM_PRODUCT_CHECKS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_PRODUCTS_CHECKS: `${key}/GET_PRODUCTS_CHECKS`,
	FULFILL_PRODUCT_CHECK: `${key}/FULFILL_PRODUCT_CHECK`,
};

export const actions = {
	save: createAction(types.SAVE),
	getProductChecks: createAction(types.GET_PRODUCTS_CHECKS),
	fulfillProductCheck: createAction(types.FULFILL_PRODUCT_CHECK),
};
