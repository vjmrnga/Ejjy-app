import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';

export const key = 'PRODUCTS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_PRODUCTS: `${key}/GET_PRODUCTS`,
	CREATE_PRODUCT: `${key}/CREATE_PRODUCT`,
	EDIT_PRODUCT: `${key}/EDIT_PRODUCT`,
	REMOVE_PRODUCT: `${key}/REMOVE_PRODUCT`,
};

const initialState = {
	products: [],
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }) => ({
			...state,
			...payload,
		}),
	},
	initialState,
);

export const actions = {
	save: createAction(types.SAVE),
	getProducts: createAction(types.GET_PRODUCTS),
	createProduct: createAction(types.CREATE_PRODUCT),
	editProduct: createAction(types.EDIT_PRODUCT),
	removeProduct: createAction(types.REMOVE_PRODUCT),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectProducts: () => createSelector(selectState, (state) => state.products),
};

export default reducer;
