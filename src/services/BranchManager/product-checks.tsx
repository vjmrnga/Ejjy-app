import axios from 'axios';
import { IGetRequest } from '../interfaces';

interface SingleProductCheckFulfill {
	product_check_product_id: number;
	fulfilled_quantity_piece: number;
}

interface IFulfillProductCheck {
	products: SingleProductCheckFulfill[];
}

interface IGetProductChecks extends IGetRequest {
	type: 'daily' | 'random';
	assigned_store_id: number;
	is_filled_up: boolean;
}

export const service = {
	list: async (params: IGetProductChecks, baseURL) =>
		axios.get('/product-checks/', { baseURL, params }),

	fulfill: async (id: number, body: IFulfillProductCheck, baseURL) =>
		axios.post(`/product-checks/${id}/fulfill/`, body, { baseURL }),
};
