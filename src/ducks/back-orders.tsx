import { createAction } from 'redux-actions';

export const key = 'BACK_ORDERS';

export const types = {
	LIST: `${key}/LIST`,
	RETRIEVE: `${key}/RETRIEVE`,
	EDIT: `${key}/EDIT`,
	RECEIVE: `${key}/RECEIVE`,
};

export const actions = {
	list: createAction(types.LIST),
	retrieve: createAction(types.RETRIEVE),
	edit: createAction(types.EDIT),
	receive: createAction(types.RECEIVE),
};
