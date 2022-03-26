import _ from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'OM_BRANCH_MACHINES';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_BRANCH_MACHINES: `${key}/GET_BRANCH_MACHINES`,
	GET_BRANCH_MACHINE: `${key}/GET_BRANCH_MACHINE`,
	RETRIEVE_BRANCH_MACHINE_SALES: `${key}/RETRIEVE_BRANCH_MACHINE_SALES`,
	RETRIEVE_BRANCH_MACHINE_SALES_ALL: `${key}/RETRIEVE_BRANCH_MACHINE_SALES_ALL`,
};

const initialState = {
	branchMachines: [],
	sales: {},
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_BRANCH_MACHINES: {
					newData = { branchMachines: payload.branchMachines };
					break;
				}
				case types.RETRIEVE_BRANCH_MACHINE_SALES_ALL: {
					const { status, sales: branchSales, timeRange, branchId } = payload;
					const { sales } = state;

					_.set(sales, [branchId, timeRange], {
						branchSales,
						status,
					});

					newData = { sales };
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
	getBranchMachines: createAction(types.GET_BRANCH_MACHINES),
	getBranchMachine: createAction(types.GET_BRANCH_MACHINE),
	retrieveBranchMachineSales: createAction(types.RETRIEVE_BRANCH_MACHINE_SALES),
	retrieveBranchMachineSalesAll: createAction(
		types.RETRIEVE_BRANCH_MACHINE_SALES_ALL,
	),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectBranchMachines: () =>
		createSelector(selectState, (state) => state.branchMachines),
};

export default reducer;
