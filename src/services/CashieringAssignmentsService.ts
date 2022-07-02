import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	branch_id: number;
	time_range: string;
	user_id: number;
}

interface Modify {
	acting_user_id: number;
	user_id?: number;
	branch_machine_id?: number;
	datetime_start: string;
	datetime_end: string;
}

interface Delete {
	acting_user_id: number;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/cashiering-assignments/', { baseURL, params }),

	create: async (body: Modify, baseURL) =>
		axios.post('/cashiering-assignments/', body, { baseURL }),

	edit: async (id: number, body: Modify, baseURL) =>
		axios.patch(`/cashiering-assignments/${id}/`, body, { baseURL }),

	delete: async (id: number, body: Delete, baseURL) =>
		axios.delete(`/cashiering-assignments/${id}/`, { data: body, baseURL }),
};

export default service;
