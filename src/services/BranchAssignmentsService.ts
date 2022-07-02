import axios from 'axios';
import { IListRequest } from 'services/interfaces';

interface List extends IListRequest {
	branch_id: number;
	user_id: number;
}

interface Modify {
	user_id: number;
	branch_id: number;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/branch-assignments/', { baseURL, params }),

	create: async (body: Modify, baseURL) =>
		axios.post('/branch-assignments/', body, { baseURL }),
};

export default service;
