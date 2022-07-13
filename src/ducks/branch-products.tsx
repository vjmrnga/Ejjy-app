import { createAction } from 'redux-actions';

export const key = 'BRANCH_PRODUCTS';

export const types = {
	GET_BRANCH_PRODUCTS: `${key}/GET_BRANCH_PRODUCTS`,
	GET_BRANCH_PRODUCT: `${key}/GET_BRANCH_PRODUCT`,
	EDIT_BRANCH_PRODUCT: `${key}/EDIT_BRANCH_PRODUCT`,
	EDIT_BRANCH_PRODUCT_BALANCE: `${key}/EDIT_BRANCH_PRODUCT_BALANCE`,
	EDIT_BRANCH_PRODUCT_PRICE_COST: `${key}/EDIT_BRANCH_PRODUCT_PRICE_COST`,
};

export const actions = {
	getBranchProducts: createAction(types.GET_BRANCH_PRODUCTS),
	getBranchProduct: createAction(types.GET_BRANCH_PRODUCT),
	editBranchProduct: createAction(types.EDIT_BRANCH_PRODUCT),
	editBranchProductBalance: createAction(types.EDIT_BRANCH_PRODUCT_BALANCE),
	editBranchProductPriceCost: createAction(
		types.EDIT_BRANCH_PRODUCT_PRICE_COST,
	),
};
