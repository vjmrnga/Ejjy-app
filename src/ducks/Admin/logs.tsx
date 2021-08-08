import { createAction } from 'redux-actions';

export const key = 'LOGS';

export const types = {
	LIST_LOGS: `${key}/LIST_LOGS`,
	GET_COUNT: `${key}/GET_COUNT`,
};

export const actions = {
	listLogs: createAction(types.LIST_LOGS),
	getCount: createAction(types.GET_COUNT),
};
