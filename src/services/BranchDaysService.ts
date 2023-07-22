import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	branch_id?: number;
	branch_machine_id?: number;
	closed_by_user_id: number;
	is_automatically_closed: boolean;
	is_unauthorized: boolean;
	opened_by_user_id: number;
	page_size: number;
	page: number;
	time_range: string;
}

interface RetrieveToday {
	branch_id: number;
}

interface Create {
	started_by_id: number;
	online_started_by_id?: number;
}

interface Edit {
	ended_by_id: number;
	online_ended_by_id?: number;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/branches-days/', { baseURL, params }),

	retrieveToday: async (params: RetrieveToday, baseURL) =>
		axios.get('/branches-days/latest-today/', { baseURL, params }),

	get: async (baseURL) => axios.get('/branches-days/latest/', { baseURL }),

	create: async (body: Create, baseURL) =>
		axios.post('/branches-days/', body, { baseURL }),

	edit: async (id: number, body: Edit, baseURL) =>
		axios.patch(`/branches-days/${id}/`, body, { baseURL }),
};

export default service;
