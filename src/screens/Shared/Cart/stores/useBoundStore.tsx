import create from 'zustand';
import { createInterfaceSlice } from './createInterfaceSlice';
import { createNavigationSlice } from './createNavigationSlice';
import { createProductsSlice } from './createProductsSlice';
import { createSearchingSlice } from './createSearchingSlice';

export const useBoundStore = create<any>()((...a) => ({
	...createInterfaceSlice(...a),
	...createNavigationSlice(...a),
	...createProductsSlice(...a),
	...createSearchingSlice(...a),
}));
