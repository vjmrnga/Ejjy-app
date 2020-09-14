import branchesReducer, { key as BRANCHES_KEY } from './branches';
import productsReducer, { key as PRODUCTS_KEY } from './products';

export const officeManagerReducers = {
	[PRODUCTS_KEY]: productsReducer,
	[BRANCHES_KEY]: branchesReducer,
};
