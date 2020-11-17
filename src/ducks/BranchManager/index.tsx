import branchesDaysReducer, { key as BRANCHES_DAYS_KEY } from './branches-days';
import deliveryReceiptsReducer, { key as DELIVERY_RECEIPTS_KEY } from './delivery-receipts';
import productChecksReducer, { key as PRODUCT_CHECKS_KEY } from './product-checks';

export const branchManagerReducers = {
	[DELIVERY_RECEIPTS_KEY]: deliveryReceiptsReducer,
	[PRODUCT_CHECKS_KEY]: productChecksReducer,
	[BRANCHES_DAYS_KEY]: branchesDaysReducer,
};
