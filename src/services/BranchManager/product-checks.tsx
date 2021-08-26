import axios from 'axios';
import { IListRequest } from '../interfaces';

interface SingleProductCheckFulfill {
	product_check_product_id: number;
	fulfilled_quantity_piece: number;
}

interface IFulfillProductCheck {
	products: SingleProductCheckFulfill[];
}

interface IListProductChecks extends IListRequest {
	type: 'daily' | 'random';
	is_filled_up: boolean;
}

export const service = {
	list: async (params: IListProductChecks, baseURL) =>
		axios.get('/product-checks/', { baseURL, params }),

	fulfill: async (id: number, body: IFulfillProductCheck, baseURL) =>
		axios.post(`/product-checks/${id}/fulfill/`, body, { baseURL }),
};
