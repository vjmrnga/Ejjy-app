import { combineReducers } from 'redux';
import requestReducer, { REQUEST_KEY } from './request';
import authReducer, { key as AUTH_KEY } from './auth';
import productsReducer, { key as PRODUCTS_KEY } from './products';
import history from '../utils/history';
import { connectRouter } from 'connected-react-router';

export default combineReducers({
	router: connectRouter(history),
	[AUTH_KEY]: authReducer,
	[REQUEST_KEY]: requestReducer,
	[PRODUCTS_KEY]: productsReducer,
});
