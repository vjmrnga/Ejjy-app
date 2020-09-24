import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'BM_DELIVERY_RECEIPTS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_DELIVERY_RECEIPT_BY_ID: `${key}/GET_DELIVERY_RECEIPT_BY_ID`,
	RECEIVE_DELIVERY_RECEIPT: `${key}/RECEIVE_DELIVERY_RECEIPT`,
};

const initialState = {
	deliveryReceipt: {},
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_DELIVERY_RECEIPT_BY_ID: {
					newData = { deliveryReceipt: payload.deliveryReceipt };
					break;
				}
				case types.RECEIVE_DELIVERY_RECEIPT: {
					// newData = { branch: payload.branch };
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
	getDeliveryReceiptById: createAction(types.GET_DELIVERY_RECEIPT_BY_ID),
	receiveDeliveryReceipt: createAction(types.RECEIVE_DELIVERY_RECEIPT),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectDeliveryReceipt: () => createSelector(selectState, (state) => state.deliveryReceipt),
};

export default reducer;
