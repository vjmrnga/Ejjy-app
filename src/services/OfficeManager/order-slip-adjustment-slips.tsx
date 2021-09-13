import axios from 'axios';
import { IListRequest } from '../interfaces';

type Product = {
	order_slip_product_id: number;
	new_fulfilled_quantity_piece: string;
};

interface ICreateOrderSlipAdjustmentSlipRequest {
	order_slip_id: number;
	creating_user_id: number;
	remarks: string;
	order_slip_adjustment_slip_products: Product[];
}

interface IOrderSlipAdjustmentSlipRequest extends IListRequest {
	order_slip_id: number;
}

export const service = {
	list: async (params: IOrderSlipAdjustmentSlipRequest, baseURL) =>
		axios.get('/order-slip-adjustment-slips/', { baseURL, params }),

	create: async (body: ICreateOrderSlipAdjustmentSlipRequest, baseURL) =>
		axios.post('/order-slip-adjustment-slips/', body, { baseURL }),
};
