import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	search?: string;
	product_ids?: number[] | number | string;
	product_status?: string;
	is_sold_in_branch?: boolean;
	product_category?: string;
	has_bo_balance?: boolean;
}

interface Edit {
	allowable_spoilage: number;
	assigned_personnel_id: number;
	cost_per_bulk: string;
	cost_per_piece: string;
	current_balance: string;
	is_daily_checked: boolean;
	is_randomly_checked: boolean;
	is_sold_in_branch: boolean;
	markdown_price_per_bulk1: string;
	markdown_price_per_bulk2: string;
	markdown_price_per_piece1: string;
	markdown_price_per_piece2: string;
	max_balance: number;
	price_per_bulk: string;
	price_per_piece: string;
	reorder_point: number;
}

interface EditPriceCost {
	product_id: number;
	cost_per_piece: string;
	cost_per_bulk: string;
	price_per_piece: string;
	price_per_bulk: string;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/branches-products/', { baseURL, params }),

	edit: async (id: Number, body: Edit, baseURL) =>
		axios.patch(`/branches-products/${id}/`, body, { baseURL }),

	editPriceCost: async (body: EditPriceCost, baseURL) =>
		axios.patch('/branches-products/update-price-and-cost/', body, { baseURL }),
};

export default service;
