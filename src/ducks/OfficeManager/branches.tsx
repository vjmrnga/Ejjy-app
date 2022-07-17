import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'OM_BRANCHES';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_BRANCHES: `${key}/GET_BRANCHES`,
	GET_BRANCH: `${key}/GET_BRANCH`,
};

const initialState = {
	branches: [],
	branch: {},
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_BRANCHES: {
					newData = { branches: payload.branches };
					break;
				}
				case types.GET_BRANCH: {
					newData = { branch: payload.branch };
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
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectBranch: () => createSelector(selectState, (state) => state.branch),
	selectBranches: () => createSelector(selectState, (state) => state.branches),
	selectBranchById: (id) =>
		createSelector(selectState, (state) =>
			state.branches.find((branch) => branch.id === id),
		),
	selectURLByBranchId: (id) =>
		createSelector(
			selectState,
			(state) =>
				state.branches.find((branch) => branch.id === id)?.online_url ??
				undefined,
		),
	selectBackUpURLByBranchId: (id) =>
		createSelector(
			selectState,
			(state) =>
				state.branches.find((branch) => branch.id === id)?.backup_server_url ??
				undefined,
		),
};

export default reducer;
