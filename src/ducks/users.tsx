import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'USERS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_USERS: `${key}/GET_USERS`,
};

const initialState = {
	users: [],
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_USERS: {
					newData = { users: payload.users };
					break;
				}
				default:
					break;
			}

			return { ...state, ...newData };
		},
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	getUsers: createAction(types.GET_USERS),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectUsers: () => createSelector(selectState, (state) => state.users),
	selectUsersByBranch: (branchId) =>
		createSelector(selectState, (state) =>
			state.users.find((user) => user?.branch?.id === branchId),
		),
};

export default reducer;
