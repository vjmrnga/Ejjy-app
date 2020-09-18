import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { request } from '../global/types';

export const REQUEST_KEY = 'REQUEST';

export const types = {
	REQUEST: `${REQUEST_KEY}`,
	SUCCESS: `${REQUEST_KEY}/SUCCESS`,
	ERROR: `${REQUEST_KEY}/ERROR`,
	RESET: `${REQUEST_KEY}/RESET`,
	RESET_MANY: `${REQUEST_KEY}/RESET_MANY`,
	CLEAR: `${REQUEST_KEY}/CLEAR`,
};

export const initialState = {
	requestStatus: {},
	errors: {},
};

const reducer = handleActions(
	{
		[types.REQUEST]: (state, { payload: { key } }: any) => {
			const { requestStatus, errors }: any = state;
			requestStatus[key] = request.REQUESTING;
			errors[key] = [];

			return {
				...state,
				errors,
				requestStatus,
			};
		},

		[types.SUCCESS]: (state, { payload: { key } }: any) => {
			const { requestStatus }: any = state;
			requestStatus[key] = request.SUCCESS;

			return {
				...state,
				requestStatus,
			};
		},

		[types.ERROR]: (state, { payload: { key, error } }: any) => {
			const { requestStatus, errors }: any = state;
			requestStatus[key] = request.ERROR;
			errors[key] = error;

			return {
				...state,
				errors,
				requestStatus,
			};
		},

		[types.RESET]: (state, { payload: key }: any) => {
			const { requestStatus, errors }: any = state;
			requestStatus[key] = request.NONE;
			errors[key] = [];

			return {
				...state,
				errors,
				requestStatus,
			};
		},

		[types.RESET_MANY]: (state, { payload: keys }: any) => {
			const { requestStatus, errors }: any = state;

			keys.forEach((key: string) => {
				requestStatus[key] = request.NONE;
				errors[key] = [];
			});

			return {
				...state,
				errors,
				requestStatus,
			};
		},

		[types.CLEAR]: () => initialState,
	},
	initialState,
);

export const actions = {
	request: createAction(types.REQUEST),
	success: createAction(types.SUCCESS),
	error: createAction(types.ERROR),
	reset: createAction(types.RESET),
	resetMany: createAction(types.RESET_MANY),
	clear: createAction(types.CLEAR),
};

const selectRequest = (state: any) => state[REQUEST_KEY] || initialState;
export const selectors = {
	selectErrors: (key: string) => createSelector(selectRequest, (state) => state.errors[key] || []),
	selectRequestStatus: (key: string) =>
		createSelector(selectRequest, (state) => state.requestStatus[key] || request.NONE),

	selectManyErrors: (keys: string[]) =>
		createSelector(selectRequest, (state) => {
			const errors: any = {};
			keys.forEach((key: string) => {
				errors[key] = key in state.errors ? state.errors[key] : [];
			});

			return errors;
		}),

	selectManyRequestStatus: (keys: string[]) =>
		createSelector(selectRequest, (state) => {
			const status: any = {};
			keys.forEach((key: string) => {
				status[key] = key in state.requestStatus ? state.requestStatus[key] : request.NONE;
			});

			return status;
		}),
};

export default reducer;
