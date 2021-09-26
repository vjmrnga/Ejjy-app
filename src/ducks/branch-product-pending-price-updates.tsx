import { createAction } from 'redux-actions';

export const key = 'PENDING_BRANCH_PRODUCT_PRICE_UPDATES';

export const types = {
	LIST: `${key}/LIST`,
	APPLY: `${key}/APPLY`,
};

export const actions = {
	list: createAction(types.LIST),
	apply: createAction(types.APPLY),
};
