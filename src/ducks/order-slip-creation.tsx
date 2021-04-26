import { cloneDeep } from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'ORDER_SLIP_CREATION';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_USERS: `${key}/GET_USERS`,
	GET_BRANCH_PRODUCTS: `${key}/GET_BRANCH_PRODUCTS`,
};

const initialState = {
	orderSlipDetails: null,
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type, branchId } = payload;
			const orderSlipDetails = state.orderSlipDetails ? cloneDeep(state.orderSlipDetails) : {};
			let newData = {};

			if (orderSlipDetails[branchId] === undefined) {
				orderSlipDetails[branchId] = {};
			}

			switch (type) {
				case types.GET_USERS: {
					orderSlipDetails[branchId]['users'] = payload.users;
					newData = { orderSlipDetails };
					break;
				}
				case types.GET_BRANCH_PRODUCTS: {
					orderSlipDetails[branchId]['branchProducts'] = payload.branchProducts;
					newData = { orderSlipDetails };
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
	getUsers: createAction(types.GET_USERS),
	getBranchProducts: createAction(types.GET_BRANCH_PRODUCTS),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectOrderSlipDetails: () => createSelector(selectState, (state) => state.orderSlipDetails),
};

export default reducer;
