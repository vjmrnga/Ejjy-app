import axios from 'axios';
import { IListRequest } from './interfaces';

// Service
export const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/pending-branch-product-price-updates/', { baseURL, params }),

	apply: async (id: number, baseURL) =>
		axios.post(`/pending-branch-product-price-updates/${id}/apply/`, null, {
			baseURL,
		}),
};
