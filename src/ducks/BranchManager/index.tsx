import deliveryReceiptsReducer, { key as DELIVERY_RECEIPTS_KEY } from './delivery-receipts';

export const branchManagerReducers = {
	[DELIVERY_RECEIPTS_KEY]: deliveryReceiptsReducer,
};
