import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'TRANSACTIONS';

export const types = {
	SAVE: `${key}/SAVE`,
	LIST_TRANSACTIONS: `${key}/LIST_TRANSACTIONS`,
};

const initialState = {
	transactions: [],
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.LIST_TRANSACTIONS: {
					newData = { transactions: payload.transactions };
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
	listTransactions: createAction(types.LIST_TRANSACTIONS),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectTransactions: () => createSelector(selectState, (state) => state.transactions),
};

export default reducer;
