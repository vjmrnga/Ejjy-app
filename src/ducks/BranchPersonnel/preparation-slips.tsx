import { cloneDeep } from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { NOT_FOUND_INDEX } from '../../global/constants';

export const key = 'BP_PREPARATION_SLIPS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_PREPARATION_SLIPS: `${key}/GET_PREPARATION_SLIPS`,
	GET_PREPARATION_SLIPS_EXTENDED: `${key}/GET_PREPARATION_SLIPS_EXTENDED`,
	CREATE_PREPARATION_SLIP: `${key}/CREATE_PREPARATION_SLIP`,
	EDIT_PREPARATION_SLIP: `${key}/EDIT_PREPARATION_SLIP`,
};

const initialState = {
	preparationSlips: [],
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_PREPARATION_SLIPS:
				case types.GET_PREPARATION_SLIPS_EXTENDED: {
					newData = { preparationSlips: payload.preparationSlips };
					break;
				}
				case types.CREATE_PREPARATION_SLIP: {
					newData = { preparationSlips: [payload.preparationSlip, ...state.preparationSlips] };
					break;
				}
				case types.EDIT_PREPARATION_SLIP: {
					const { preparationSlip: editedPreparationSlip } = payload;
					const index = state.preparationSlips.findIndex(
						({ id }) => id === editedPreparationSlip.id,
					);

					if (index !== NOT_FOUND_INDEX) {
						const preparationSlips = cloneDeep(state.preparationSlips);
						preparationSlips[index] = editedPreparationSlip;
						newData = { preparationSlips };
					}
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
	getPreparationSlips: createAction(types.GET_PREPARATION_SLIPS),
	getPreparationSlipsExtended: createAction(types.GET_PREPARATION_SLIPS_EXTENDED),
	createPreparationSlip: createAction(types.CREATE_PREPARATION_SLIP),
	editPreparationSlip: createAction(types.EDIT_PREPARATION_SLIP),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectPreparationSlips: () => createSelector(selectState, (state) => state.preparationSlips),
};

export default reducer;
