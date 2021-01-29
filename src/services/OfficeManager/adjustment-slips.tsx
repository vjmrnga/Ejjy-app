import axios from 'axios';
import { IGetRequest } from '../interfaces';

interface AdjustmentSlipProduct {
	delivery_receipt_product_id: number;
	new_delivered_quantity_piece?: number;
	new_received_quantity_piece?: number;
}

interface ICreateAdjustmentSlip {
	delivery_receipt_id: number;
	creating_user_id: number;
	remarks?: string;
	adjustment_slip_products: AdjustmentSlipProduct[];
}

interface IGetByDeliveryReceiptId extends IGetRequest {
	delivery_receipt_id: number;
}

export const service = {
	getByDeliveryReceiptId: async (params: IGetByDeliveryReceiptId, baseURL) =>
		axios.get('/adjustment-slips/', { baseURL, params }),

	create: async (body: ICreateAdjustmentSlip, baseURL) =>
		axios.post('/adjustment-slips/', body, { baseURL }),
};
