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
	allowable_spoilage?: number;
}

interface IGetBranchProductsByBranchRequest extends IGetRequest {
	branch_id: number;
}

export const service = {
	list: async (params: IGetRequest) => axios.get('/branches-products/extended/', { params }),
	listByBranch: async (params: IGetBranchProductsByBranchRequest) =>
		axios.get('branches-products/with-branch-manager-details/', { params }),
	edit: async (body: IEditBranchProduct) => axios.patch(`/branches-products/${body.id}/`, body),
};
