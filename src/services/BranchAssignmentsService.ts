import axios from 'axios';
import { IListRequest } from 'services/interfaces';

interface List extends IListRequest {
	branch_id: number;
	time_range: string;
	user_id: number;
}

interface Modify {
	branch_id: number;
	user_id: number;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/branch-assignments/', { baseURL, params }),

	create: async (body: Modify, baseURL) =>
		axios.post('/branch-assignments/', body, { baseURL }),
};

const serviceOffline = {
	listOffline: async (baseURL) =>
		axios.get('/offline-branch-assignments/', { baseURL }),
};

export default {
	...service,
	...serviceOffline,
};
