import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'X_READ_REPORTS';

export const types = {
	SAVE: `${key}/SAVE`,
	CREATE_XREAD_REPORT: `${key}/CREATE_XREAD_REPORT`,
};

const initialState = {
	xreadReport: null,
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.CREATE_XREAD_REPORT: {
					newData = { xreadReport: payload.xreadReport };
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
	createXreadReport: createAction(types.CREATE_XREAD_REPORT),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectXreadReport: () =>
		createSelector(selectState, (state) => state.xreadReport),
};

export default reducer;
