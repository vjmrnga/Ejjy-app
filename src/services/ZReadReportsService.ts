import axios from 'axios';
import { IListRequest } from 'services/interfaces';

interface List extends IListRequest {
	time_range: string;
}

interface Create {
	branch_machine_id: number;
	user_id: number;
	date: string;
}

const service = {
	list: async (params: List, baseURL: string) =>
		axios.get('/zread-reports/', { baseURL, params }),

	create: async (body: Create, baseURL) =>
		axios.post('/zread-reports/', body, { baseURL }),
};

export default service;
