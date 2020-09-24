import orderSlipsReducer, { key as ORDER_SLIPS_KEY } from '../order-slips';
import branchesReducer, { key as BRANCHES_KEY } from './branches';
import deliveryReceiptsReducer, { key as DELIVERY_RECEIPTS_KEY } from './delivery-receipts';
import productsReducer, { key as PRODUCTS_KEY } from './products';

export const officeManagerReducers = {
	[PRODUCTS_KEY]: productsReducer,
	[BRANCHES_KEY]: branchesReducer,
	[ORDER_SLIPS_KEY]: orderSlipsReducer,
	[DELIVERY_RECEIPTS_KEY]: deliveryReceiptsReducer,
};
