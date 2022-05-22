import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	is_vat_exempted?: boolean;
	or_number?: boolean;
	statuses?: string;
	time_range?: string;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/transaction-products/', { baseURL, params }),
};

export default service;
