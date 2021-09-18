import axios from 'axios';
import { IListRequest } from '../interfaces';

// Interfaces
interface List extends IListRequest {
	back_order_id: number;
}

interface Create {
	back_order_id: number;
	creating_user_id: number;
	remarks: string;
	back_order_adjustment_slip_products: Product[];
}

// Types
type Product = {
	back_order_product_id: number;
	new_quantity_received: string;
};

// Service
export const service = {
	list: async (params: List, baseURL) =>
		axios.get('/back-order-adjustment-slips/', { baseURL, params }),

	create: async (body: Create, baseURL) =>
		axios.post('/back-order-adjustment-slips/', body, { baseURL }),
};
