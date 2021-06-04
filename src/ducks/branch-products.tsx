import { createAction } from 'redux-actions';

export const key = 'BRANCH_PRODUCTS';

export const types = {
	GET_BRANCH_PRODUCTS: `${key}/GET_BRANCH_PRODUCTS`,
	GET_BRANCH_PRODUCTS_BY_BRANCH: `${key}/GET_BRANCH_PRODUCTS_BY_BRANCH`,
	EDIT_BRANCH_PRODUCT: `${key}/EDIT_BRANCH_PRODUCT`,
	EDIT_BRANCH_PRODUCT_BALANCE: `${key}/EDIT_BRANCH_PRODUCT_BALANCE`,
};

export const actions = {
	getBranchProducts: createAction(types.GET_BRANCH_PRODUCTS),
	getBranchProductsByBranch: createAction(types.GET_BRANCH_PRODUCTS_BY_BRANCH),
	editBranchProduct: createAction(types.EDIT_BRANCH_PRODUCT),
	editBranchProductBalance: createAction(types.EDIT_BRANCH_PRODUCT_BALANCE),
};
