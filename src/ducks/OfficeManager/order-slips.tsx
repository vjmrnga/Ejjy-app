import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'OM_ORDER_SLIPS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_ORDER_SLIPS: `${key}/GET_ORDER_SLIPS`,
	GET_ORDER_SLIPS_EXTENDED: `${key}/GET_ORDER_SLIPS_EXTENDED`,
	CREATE_ORDER_SLIP: `${key}/CREATE_ORDER_SLIP`,
	EDIT_ORDER_SLIP: `${key}/EDIT_ORDER_SLIP`,
	REMOVE_ORDER_SLIP: `${key}/REMOVE_ORDER_SLIP`,
};

const initialState = {
	orderSlips: [],
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_ORDER_SLIPS:
				case types.GET_ORDER_SLIPS_EXTENDED: {
					newData = { orderSlips: payload.orderSlips };
					break;
				}
				// case types.CREATE_BRANCH: {
				// 	newData = { branches: [payload.branch, ...state.branches] };
				// 	break;
				// }
				// case types.EDIT_BRANCH: {
				// 	const { branch: editedBranch } = payload;
				// 	const index = state.branches.findIndex(({ id }) => id === editedBranch.id);

				// 	if (index !== NOT_FOUND_INDEX) {
				// 		const branches = cloneDeep(state.branches);
				// 		branches[index] = editedBranch;
				// 		newData = { branches };
				// 	}
				// 	break;
				// }
				// case types.REMOVE_BRANCH: {
				// 	newData = { branches: state.branches.filter(({ id }) => id !== payload.id) };
				// 	break;
				// }
			}

			return { ...state, ...newData };
		},
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	getOrderSlips: createAction(types.GET_ORDER_SLIPS),
	getOrderSlipsExtended: createAction(types.GET_ORDER_SLIPS_EXTENDED),
	createOrderSlip: createAction(types.CREATE_ORDER_SLIP),
	editOrderSlip: createAction(types.EDIT_ORDER_SLIP),
	removeOrderSlip: createAction(types.REMOVE_ORDER_SLIP),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectOrderSlips: () => createSelector(selectState, (state) => state.orderSlips),
};

export default reducer;
