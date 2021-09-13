import { createAction } from 'redux-actions';

export const key = 'OM_PREPARATION_SLIPS';

export const types = {
	LIST: `${key}/LIST`,
	RETRIEVE: `${key}/RETRIEVE`,
};

export const actions = {
	list: createAction(types.LIST),
	retrieve: createAction(types.RETRIEVE),
};
