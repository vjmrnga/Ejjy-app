import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'PENDING_TRANSACTIONS';

export const types = {
	SAVE: `${key}/SAVE`,
	LIST_PENDING_TRANSACTIONS: `${key}/LIST_PENDING_TRANSACTIONS`,
	GET_PENDING_TRANSACTIONS_COUNT: `${key}/GET_PENDING_TRANSACTIONS_COUNT`,
	CREATE_PENDING_TRANSACTION: `${key}/CREATE_PENDING_TRANSACTION`,
	EDIT_PENDING_TRANSACTION: `${key}/EDIT_PENDING_TRANSACTION`,
	REMOVE_PENDING_TRANSACTION: `${key}/REMOVE_PENDING_TRANSACTION`,
	EXECUTE_PENDING_TRANSACTION: `${key}/EXECUTE_PENDING_TRANSACTION`,
};

const initialState = {
	pendingTransactionsCount: 0,
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_PENDING_TRANSACTIONS_COUNT: {
					newData = {
						pendingTransactionsCount: payload.pendingTransactionsCount,
					};
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
	listPendingTransactions: createAction(types.LIST_PENDING_TRANSACTIONS),
	getPendingTransactionsCount: createAction(
		types.GET_PENDING_TRANSACTIONS_COUNT,
	),
	createPendingTransaction: createAction(types.CREATE_PENDING_TRANSACTION),
	editPendingTransaction: createAction(types.EDIT_PENDING_TRANSACTION),
	removePendingTransaction: createAction(types.REMOVE_PENDING_TRANSACTION),
	executePendingTransaction: createAction(types.EXECUTE_PENDING_TRANSACTION),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectPendingTransactionsCount: () =>
		createSelector(selectState, (state) => state.pendingTransactionsCount),
};

export default reducer;
