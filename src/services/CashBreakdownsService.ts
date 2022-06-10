import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	branch_machine_id?: number;
	category?: string;
	creating_user_id?: number;
	time_range?: string;
	type?: string;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/cash-breakdowns/', { baseURL, params }),
};
export default service;
