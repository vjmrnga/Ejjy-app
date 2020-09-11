import axios from 'axios';
import { IGetRequest } from './interfaces';

interface IEditBranchProduct {
	id?: number;
	branch_id?: number;
	product_id?: number;
	reorder_point?: number;
	max_balance?: number;
	price_per_piece?: number;
	price_per_bulk?: number;
	current_balance?: number;
}

export const service = {
	list: async (params: IGetRequest) => axios.get('/branches-products/extended/', { params }),
	getBranchProductsByBranch: async (id) => axios.get(`/branches-products/${id}/`),
	editBranchProduct: async (body: IEditBranchProduct) =>
		axios.patch(`/branches-products/${body.id}/`, body),
};
