import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'BM_PURCHASE_REQUESTS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_PURCHASE_REQUESTS: `${key}/GET_PURCHASE_REQUESTS`,
	GET_PURCHASE_REQUESTS_EXTENDED: `${key}/GET_PURCHASE_REQUESTS_EXTENDED`,
	CREATE_PURCHASE_REQUEST: `${key}/CREATE_PURCHASE_REQUEST`,
};

const initialState = {
	purchaseRequests: [],
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_PURCHASE_REQUESTS:
				case types.GET_PURCHASE_REQUESTS_EXTENDED: {
					newData = { purchaseRequests: payload.purchaseRequests };
					break;
				}
				case types.CREATE_PURCHASE_REQUEST: {
					newData = { purchaseRequests: [payload.purchaseRequest, ...state.purchaseRequests] };
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
	getPurchaseRequests: createAction(types.GET_PURCHASE_REQUESTS),
	getPurchaseRequestsExtended: createAction(types.GET_PURCHASE_REQUESTS_EXTENDED),
	createPurchaseRequest: createAction(types.CREATE_PURCHASE_REQUEST),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectPurchaseRequests: () => createSelector(selectState, (state) => state.purchaseRequests),
};

export default reducer;
