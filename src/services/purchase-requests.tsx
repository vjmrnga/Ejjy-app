import axios from 'axios';
import { IGetRequest } from './interfaces';

type Product = {
	product_id: number;
	quantity_piece: number;
	quantity_bulk: number;
};

interface ICreatePurchaseRequest {
	requestor_id: number;
	type: 'manual' | 'automatic';
	products: Product[];
}

interface IGetRequestPurchaseRequest extends IGetRequest {
	id: number;
}

export const service = {
	list: async (params: IGetRequestPurchaseRequest) => axios.get('/purchase-requests/', { params }),
	listExtended: async (params: IGetRequestPurchaseRequest) =>
		axios.get('/purchase-requests/extended/', { params }),
	createPurchaseRequest: async (body: ICreatePurchaseRequest) =>
		axios.post('/purchase-requests/', body),
};
