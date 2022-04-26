import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	account_id: number;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/points-transactions/', { baseURL, params }),
};
export default service;
