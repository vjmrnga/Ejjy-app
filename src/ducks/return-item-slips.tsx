import { createAction } from 'redux-actions';

export const key = 'RETURN_ITEM_SLIPS';

export const types = {
	LIST: `${key}/LIST`,
	RETRIEVE: `${key}/RETRIEVE`,
	CREATE: `${key}/CREATE`,
	EDIT: `${key}/EDIT`,
	RECEIVE: `${key}/RECEIVE`,
};

export const actions = {
	list: createAction(types.LIST),
	retrieve: createAction(types.RETRIEVE),
	create: createAction(types.CREATE),
	edit: createAction(types.EDIT),
	receive: createAction(types.RECEIVE),
};
