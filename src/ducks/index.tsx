import { combineReducers } from 'redux';
import requestReducer, { REQUEST_KEY } from './request';
import authReducer, { key as AUTH_KEY } from './auth';
import productsReducer, { key as PRODUCTS_KEY } from './products';
import branchesReducer, { key as BRANCHES_KEY } from './branches';
import branchProductsReducer, { key as BRANCH_PRODUCTS_KEY } from './branch-products';
import history from '../utils/history';
import { connectRouter } from 'connected-react-router';
import { branchManagerReducers } from './BranchManager';

export default combineReducers({
	router: connectRouter(history),
	[AUTH_KEY]: authReducer,
	[REQUEST_KEY]: requestReducer,
	[PRODUCTS_KEY]: productsReducer,
	[BRANCHES_KEY]: branchesReducer,
	[BRANCH_PRODUCTS_KEY]: branchProductsReducer,
	...branchManagerReducers,
});
