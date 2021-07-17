import { createAction } from 'redux-actions';

export const key = 'UPDATE_BRANCH_PRODUCT_BALANCE';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_UPDATE_BRANCH_PRODUCT_BALANCE_LOGS: `${key}/GET_UPDATE_BRANCH_PRODUCT_BALANCE_LOGS`,
};

export const actions = {
	save: createAction(types.SAVE),
	getUpdateBranchProductBalanceLogs: createAction(
		types.GET_UPDATE_BRANCH_PRODUCT_BALANCE_LOGS,
	),
};
