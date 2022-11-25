import axios from 'axios';
import { IListRequest } from './interfaces';

type Schedule = {
	id: number;
	attendance_time: string;
};

interface List extends IListRequest {
	employee_id: number;
}

interface Bulk {
	schedules: Schedule[];
}

interface Edit {
	attendance_time: string;
}

const service = {
	list: async (params: List, baseURL: string) =>
		axios.get('/attendance-schedules/', { baseURL, params }),

	bulkEdit: async (body: Bulk, baseURL: string) =>
		axios.patch(`/attendance-schedules/bulk-update/`, body, { baseURL }),

	edit: async (id: number, body: Edit, baseURL: string) =>
		axios.patch(`/attendance-schedules/${id}/`, body, { baseURL }),
};

export default service;
