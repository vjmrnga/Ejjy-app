import branchesReducer, { key as BRANCHES_KEY } from './branches';
import productsReducer, { key as PRODUCTS_KEY } from './products';
import orderSlipsReducer, { key as ORDER_SLIPS_KEY } from './order-slips';

export const officeManagerReducers = {
	[PRODUCTS_KEY]: productsReducer,
	[BRANCHES_KEY]: branchesReducer,
	[ORDER_SLIPS_KEY]: orderSlipsReducer,
};
