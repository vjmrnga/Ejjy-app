import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	branch_id: number;
	branch_machine_id: number;
	time_range?: string;
	type?: string;
}

interface Create {
	branch_id?: number;
	branch_machine_id?: number;
	type: string;
}

const service = {
	list: async (params: List, baseURL = null) =>
		axios.get<any[]>('connectivity-logs/', { baseURL, params }),

	create: async (body: Create, baseURL = null) =>
		axios.post('/connectivity-logs/', body, { baseURL }),
};

export default service;
