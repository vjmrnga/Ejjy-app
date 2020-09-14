import { cloneDeep } from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { NOT_FOUND_INDEX } from '../../global/variables';

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
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_PRODUCTS: {
					newData = { products: payload.products };
					break;
				}
				case types.CREATE_PRODUCT: {
					newData = { products: [payload.product, ...state.products] };
					break;
				}
				case types.EDIT_PRODUCT: {
					const { product: editedProduct } = payload;
					const index = state.products.findIndex(({ id }) => id === editedProduct.id);

					if (index !== NOT_FOUND_INDEX) {
						const products = cloneDeep(state.products);
						products[index] = editedProduct;
						newData = { products };
					}
					break;
				}
				case types.REMOVE_PRODUCT: {
					newData = { products: state.products.filter(({ id }) => id !== payload.id) };
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
