import axios from 'axios';
import { IListRequest } from './interfaces';

interface IList extends IListRequest {
	is_pending?: boolean;
	payor_id?: number;
	time_range?: string;
}

interface IModify {
	created_by_id: number;
	payor_id: number;
	amount: string;
	purpose: string;
	extra_description?: string;
	charge_sales_transaction_id?: number;
}

const service = {
	list: async (params: IList, baseURL: string) =>
		axios.get('/order-of-payments/', { baseURL, params }),

	create: async (body: IModify, baseURL: string) =>
		axios.post('/order-of-payments/', body, { baseURL }),
};

export default service;
