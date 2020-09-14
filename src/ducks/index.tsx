import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import history from '../utils/history';
import authReducer, { key as AUTH_KEY } from './auth';
import branchProductsReducer, { key as BRANCH_PRODUCTS_KEY } from './branch-products';
import { branchManagerReducers } from './BranchManager';
import { officeManagerReducers } from './OfficeManager';
import purchaseRequestsReducer, { key as PURCHASE_REQUESTS_KEY } from './purchase-requests';
import requestReducer, { REQUEST_KEY } from './request';

export default combineReducers({
	router: connectRouter(history),
	[AUTH_KEY]: authReducer,
	[REQUEST_KEY]: requestReducer,
	[BRANCH_PRODUCTS_KEY]: branchProductsReducer,
	[PURCHASE_REQUESTS_KEY]: purchaseRequestsReducer,
	...officeManagerReducers,
	...branchManagerReducers,
});
