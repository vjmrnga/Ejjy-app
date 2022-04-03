import axios from 'axios';
import { IListRequest } from './interfaces';

// Interfaces
interface List extends IListRequest {
	search?: string;
	product_ids?: number[];
	product_status?: string;
	is_sold_in_branch?: boolean;
	product_category?: string;
	has_bo_balance?: boolean;
}

interface Edit {
	id?: number;
	reorder_point?: number;
	max_balance?: number;
	price_per_piece?: number;
	markdown_price_per_piece1?: number;
	markdown_price_per_piece2?: number;
	price_per_bulk?: number;
	markdown_price_per_bulk1?: number;
	markdown_price_per_bulk2?: number;
	current_balance?: number;
	is_sold_in_branch?: boolean;
}

interface EditBalance {
	product_id: number;
	added_balance: number;
	destination_branch_id: number;
	updating_user_id: number;
}

interface EditPriceCost {
	product_id: number;
	cost_per_piece: string;
	cost_per_bulk: string;
	price_per_piece: string;
	price_per_bulk: string;
}

// Service
export const service = {
	list: async (params: List, baseURL) =>
		axios.get('/branches-products/', { baseURL, params }),

	listWithAnalytics: async (params: List, baseURL) =>
		axios.get('/branches-products/with-analytics/', { baseURL, params }),

	edit: async (body: Edit, baseURL) =>
		axios.patch(`/branches-products/${body.id}/`, body, { baseURL }),

	editBalance: async (body: EditBalance, baseURL) =>
		axios.patch('/branches-products/update-balance-and-retrieve/', body, {
			baseURL,
		}),

	editPriceCost: async (body: EditPriceCost, baseURL) =>
		axios.patch('/branches-products/update-price-and-cost/', body, { baseURL }),
};
