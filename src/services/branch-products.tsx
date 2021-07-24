import axios from 'axios';
import { IGetRequest } from './interfaces';

interface IEditBranchProduct {
	id?: number;
	reorder_point?: number;
	max_balance?: number;
	price_per_piece?: number;
	discounted_price_per_piece1?: number;
	discounted_price_per_piece2?: number;
	price_per_bulk?: number;
	discounted_price_per_bulk1?: number;
	discounted_price_per_bulk2?: number;
	current_balance?: number;
	is_sold_in_branch?: boolean;
}

interface IEditBranchProductBalance {
	product_id: number;
	added_balance: number;
	destination_branch_id: number;
	updating_user_id: number;
}

interface IEditBranchProductPriceCost {
	product_id: number;
	cost_per_piece: string;
	cost_per_bulk: string;
	price_per_piece: string;
	price_per_bulk: string;
}

interface IGetBranchProducts extends IGetRequest {
	search?: string;
	product_ids?: number[];
	product_status?: string;
}

export const service = {
	list: async (params: IGetBranchProducts, baseURL) =>
		axios.get('/branches-products/', { baseURL, params }),

	listWithAnalytics: async (params: IGetBranchProducts, baseURL) =>
		axios.get('/branches-products/with-analytics/', { baseURL, params }),

	edit: async (body: IEditBranchProduct, baseURL) =>
		axios.patch(`/branches-products/${body.id}/`, body, { baseURL }),

	editBalance: async (body: IEditBranchProductBalance, baseURL) =>
		axios.patch('/branches-products/update-balance-and-retrieve/', body, {
			baseURL,
		}),

	editPriceCost: async (body: IEditBranchProductPriceCost, baseURL) =>
		axios.patch('/branches-products/update-price-and-cost/', body, { baseURL }),
};
