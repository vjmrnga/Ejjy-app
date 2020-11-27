import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'CASHIERING_SESSIONS';

export const types = {
	SAVE: `${key}/SAVE`,
	LIST_SESSIONS: `${key}/LIST_SESSIONS`,
};

const initialState = {
	sessions: [],
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.LIST_SESSIONS: {
					newData = { sessions: payload.sessions };
					break;
				}
			}

			return { ...state, ...newData };
		},
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	listSessions: createAction(types.LIST_SESSIONS),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectSessions: () => createSelector(selectState, (state) => state.sessions),
};

export default reducer;
