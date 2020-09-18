import { omit } from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'BM_PURCHASE_REQUESTS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_PURCHASE_REQUESTS: `${key}/GET_PURCHASE_REQUESTS`,
	GET_PURCHASE_REQUESTS_EXTENDED: `${key}/GET_PURCHASE_REQUESTS_EXTENDED`,
	GET_PURCHASE_REQUEST_BY_ID: `${key}/GET_PURCHASE_REQUEST_BY_ID`,
	GET_PURCHASE_REQUEST_BY_ID_AND_BRANCH: `${key}/GET_PURCHASE_REQUEST_BY_ID_AND_BRANCH`,
	CREATE_PURCHASE_REQUEST: `${key}/CREATE_PURCHASE_REQUEST`,

	REMOVE_PURCHASE_REQUEST_BY_BRANCH: `${key}/REMOVE_PURCHASE_REQUEST_BY_BRANCH`,
};

const initialState = {
	purchaseRequests: [],
	purchaseRequest: null,
	purchaseRequestsByBranch: {},
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
				case types.GET_PURCHASE_REQUEST_BY_ID: {
					newData = { purchaseRequest: payload.purchaseRequest };
					break;
				}
				case types.GET_PURCHASE_REQUEST_BY_ID_AND_BRANCH: {
					const purchaseRequestsByBranch = state.purchaseRequestsByBranch;
					purchaseRequestsByBranch[payload?.branchId] = payload.purchaseRequest;
					newData = { purchaseRequestsByBranch };
					break;
				}
				case types.CREATE_PURCHASE_REQUEST: {
					newData = { purchaseRequests: [payload.purchaseRequest, ...state.purchaseRequests] };
					break;
				}
			}

			return { ...state, ...newData };
		},

		[types.REMOVE_PURCHASE_REQUEST_BY_BRANCH]: (state, { payload }: any) => {
			const { branchId } = payload;
			return { ...state, purchaseRequestsByBranch: omit(state.purchaseRequestsByBranch, branchId) };
		},
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	getPurchaseRequests: createAction(types.GET_PURCHASE_REQUESTS),
	getPurchaseRequestsExtended: createAction(types.GET_PURCHASE_REQUESTS_EXTENDED),
	getPurchaseRequestById: createAction(types.GET_PURCHASE_REQUEST_BY_ID),
	getPurchaseRequestByIdAndBranch: createAction(types.GET_PURCHASE_REQUEST_BY_ID_AND_BRANCH),
	createPurchaseRequest: createAction(types.CREATE_PURCHASE_REQUEST),

	removePurchaseRequestByBranch: createAction(types.REMOVE_PURCHASE_REQUEST_BY_BRANCH),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectPurchaseRequest: () => createSelector(selectState, (state) => state.purchaseRequest),
	selectPurchaseRequestsByBranch: () =>
		createSelector(selectState, (state) => state.purchaseRequestsByBranch),
	selectPurchaseRequests: () => createSelector(selectState, (state) => state.purchaseRequests),
	selectPurchaseRequestById: (id) =>
		createSelector(selectState, (state) =>
			state.purchaseRequests.find((purchaseRequest) => purchaseRequest.id === id),
		),
};

export default reducer;
