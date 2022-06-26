import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	branch_id?: number;
	branch_machine_id?: number;
	is_automatically_closed: boolean;
	is_unauthorized: boolean;
	page: number;
	page_size: number;
	time_range: string;
	user_id: number;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/cashiering-sessions/', { baseURL, params }),
};

export default service;
