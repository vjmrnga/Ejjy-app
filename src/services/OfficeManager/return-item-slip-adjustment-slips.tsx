import axios from 'axios';
import { IListRequest } from '../interfaces';

// Interfaces
interface List extends IListRequest {
	return_item_slip_id: number;
}

interface Create {
	return_item_slip_id: number;
	creating_user_id: number;
	remarks: string;
	return_item_slip_adjustment_slip_products: Product[];
}

// Types
type Product = {
	return_item_slip_product_id: number;
	new_quantity_received: string;
};

// Service
export const service = {
	list: async (params: List, baseURL) =>
		axios.get('/return-item-slip-adjustment-slips/', { baseURL, params }),

	create: async (body: Create, baseURL) =>
		axios.post('/return-item-slip-adjustment-slips/', body, { baseURL }),
};
