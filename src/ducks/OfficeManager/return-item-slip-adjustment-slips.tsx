import { createAction } from 'redux-actions';

export const key = 'RETURN_ITEM_SLIP_ADJUSTMENT_SLIPS';

export const types = {
	LIST: `${key}/LIST`,
	CREATE: `${key}/CREATE`,
};

export const actions = {
	list: createAction(types.LIST),
	create: createAction(types.CREATE),
};
