import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'FAILED_TRANSFER';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_FAILED_TRANSFER_COUNT: `${key}/GET_FAILED_TRANSFER_COUNT`,
};

const initialState = {
	failedTransfers: {},
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type, branchId } = payload;
			let newData = {};

			switch (type) {
				case types.GET_FAILED_TRANSFER_COUNT: {
					newData = cloneDeep(state.failedTransfers);
					newData[branchId] = {
						count: payload.count,
						datetime: dayjs(),
					};
					break;
				}
			}

			return { failedTransfers: newData };
		},
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	getFailedTansferCount: createAction(types.GET_FAILED_TRANSFER_COUNT),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectFailedTransfers: () => createSelector(selectState, (state) => state.failedTransfers),
};

export default reducer;
