/* eslint-disable no-param-reassign */
import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import history from '../utils/history';
import { adminReducers } from './Admin';
import { branchManagerReducers } from './BranchManager';
import { officeManagerReducers } from './OfficeManager';
import requestReducer, { REQUEST_KEY } from './request';
import requisitionSlipsReducer, {
	key as REQUISITION_SLIP_KEY,
} from './requisition-slips';
import uiReducer, { key as UI_KEY } from './ui';

const appReducer = combineReducers({
	router: connectRouter(history),

	[REQUEST_KEY]: requestReducer,
	[REQUISITION_SLIP_KEY]: requisitionSlipsReducer,
	[UI_KEY]: uiReducer,
	...adminReducers,
	...officeManagerReducers,
	...branchManagerReducers,
});

export default (state, action) => {
	return appReducer(state, action);
};
