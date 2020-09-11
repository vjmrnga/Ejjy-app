import purchaseRequestsReducer, { key as PURCHASE_REQUESTS_KEY } from './purchase-requests';

export const branchManagerReducers = {
	[PURCHASE_REQUESTS_KEY]: purchaseRequestsReducer,
};
