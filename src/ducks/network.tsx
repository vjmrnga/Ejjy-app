import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'NETWORK';

export const types = {
	TEST_CONNECTION: `${key}/TEST_CONNECTION`,
	TEST_BRANCH_CONNECTION: `${key}/TEST_BRANCH_CONNECTION`,
	UPDATE_INTERNET_CONNECTION: `${key}/UPDATE_INTERNET_CONNECTION`,
};

const initialState = {
	hasInternetConnection: true,
};

const reducer = handleActions(
	{
		[types.UPDATE_INTERNET_CONNECTION]: (state, { payload }: any) => ({
			...state,
			hasInternetConnection: payload,
		}),
	},
	initialState,
);

export const actions = {
	updateInternetConnection: createAction(types.UPDATE_INTERNET_CONNECTION),
	testConnection: createAction(types.TEST_CONNECTION),
	testBranchConnection: createAction(types.TEST_BRANCH_CONNECTION),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectHasInternetConnection: () =>
		createSelector(selectState, (state) => state.hasInternetConnection),
};

export default reducer;
