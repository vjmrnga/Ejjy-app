import axios from 'axios';
import { IListRequest } from './interfaces';

interface IList extends IListRequest {
	is_vat_exempted?: boolean;
	or_number?: boolean;
	time_range?: string;
}

const service = {
	list: async (params: IList, baseURL) =>
		axios.get('/transaction-products/', { baseURL, params }),

	summary: async (params: IList, baseURL) =>
		axios.get('/transaction-products/summary/', { baseURL, params }),
};

export default service;
