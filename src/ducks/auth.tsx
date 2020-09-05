import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'AUTH';

export const types = {
	SAVE: `${key}/SAVE`,
	LOGIN: `${key}/LOGIN`,
	LOGIN_RESET: `${key}/LOGIN_RESET`,
};

const initialState = {
	user: {},
	accessToken: null,
	refreshToken: null,
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }) => ({
			...state,
			...payload,
		}),
		[types.LOGIN_RESET]: () => initialState,
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	login: createAction(types.LOGIN),
	loginReset: createAction(types.LOGIN_RESET),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectAccessToken: () => createSelector(selectState, (state) => state.accessToken),
	selectRefreshToken: () => createSelector(selectState, (state) => state.refreshToken),
};

export default reducer;
