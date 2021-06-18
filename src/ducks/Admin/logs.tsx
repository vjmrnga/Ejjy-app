import { createAction } from 'redux-actions';

export const key = 'LOGS';

export const types = {
	GET_UPDATE_BRANCH_PRODUCT_BALANCE_LOGS: `${key}/GET_UPDATE_BRANCH_PRODUCT_BALANCE_LOGS`,
};

export const actions = {
	getUpdateBranchProductBalanceLogs: createAction(types.GET_UPDATE_BRANCH_PRODUCT_BALANCE_LOGS),
};
