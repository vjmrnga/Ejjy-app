import { cloneDeep } from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import { createSelector } from 'reselect';
import { NOT_FOUND_INDEX } from '../global/variables';

export const key = 'BRANCH_PRODUCTS';

export const types = {
	SAVE: `${key}/SAVE`,
	GET_BRANCH_PRODUCTS: `${key}/GET_BRANCH_PRODUCTS`,
	GET_BRANCH_PRODUCTS_BY_BRANCH: `${key}/GET_BRANCH_PRODUCTS_BY_BRANCH`,
	CREATE_BRANCH_PRODUCT: `${key}/CREATE_BRANCH_PRODUCT`,
	EDIT_BRANCH_PRODUCT: `${key}/EDIT_BRANCH_PRODUCT`,
	REMOVE_BRANCH_PRODUCT: `${key}/REMOVE_BRANCH_PRODUCT`,
};

const initialState = {
	branchProducts: [],
};

const reducer = handleActions(
	{
		[types.SAVE]: (state, { payload }: any) => {
			const { type } = payload;
			let newData = {};

			switch (type) {
				case types.GET_BRANCH_PRODUCTS: {
					const { branchProducts } = state;
					const fetchedBranchProducts = payload.branchProducts;

					const newBranchProducts = fetchedBranchProducts.filter((fetchedBranchProduct) => {
						const index = branchProducts.findIndex(({ id }) => id === fetchedBranchProduct.id);
						return index === NOT_FOUND_INDEX; // Insert if not in the list yet
					});

					newData = { branchProducts: [...state.branchProducts, ...newBranchProducts] };
					break;
				}
				case types.CREATE_BRANCH_PRODUCT: {
					newData = { branchProducts: [payload.branchProduct, ...state.branchProducts] };
					break;
				}
				case types.EDIT_BRANCH_PRODUCT: {
					const { branchProduct: editedBranchProduct } = payload;
					const index = state.branchProducts.findIndex(({ id }) => id === editedBranchProduct.id);

					if (index !== NOT_FOUND_INDEX) {
						const branchProducts = cloneDeep(state.branchProducts);
						branchProducts[index] = editedBranchProduct;
						newData = { branchProducts };
					}
					break;
				}
				case types.REMOVE_BRANCH_PRODUCT: {
					newData = { branchProducts: state.branchProducts.filter(({ id }) => id !== payload.id) };
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
	getBranchProducts: createAction(types.GET_BRANCH_PRODUCTS),
	getBranchProductsByBranch: createAction(types.GET_BRANCH_PRODUCTS_BY_BRANCH),
	createBranchProduct: createAction(types.CREATE_BRANCH_PRODUCT),
	editBranchProduct: createAction(types.EDIT_BRANCH_PRODUCT),
	removeBranchProduct: createAction(types.REMOVE_BRANCH_PRODUCT),
};

const selectState = (state: any) => state[key] || initialState;
export const selectors = {
	selectBranchProducts: () => createSelector(selectState, (state) => state.branchProducts),
};

export default reducer;
