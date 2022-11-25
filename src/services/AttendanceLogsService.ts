import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	attendance_category?: 'attendance' | 'tracker';
	attendance_type?: 'in' | 'out';
	branch_id?: number;
	employee_id?: number;
	time_range?: string;
}

interface Create {
	attendance_category: 'attendance' | 'tracker';
	branch_id: number;
	employee_id: number;
}

const service = {
	list: async (params: List, baseURL: string) =>
		axios.get('/attendance-logs/', { baseURL, params }),

	create: async (body: Create, baseURL: string) =>
		axios.post('/attendance-logs/', body, { baseURL }),
};

export default service;
