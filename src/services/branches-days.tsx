import axios from 'axios';
import { IListRequest } from './interfaces';

interface ICreateBranchDay {
	started_by_id: number;
	online_started_by_id?: number;
}

interface IEditBranchDay {
	ended_by_id: number;
	online_ended_by_id?: number;
}

export const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/branches-days/', { baseURL, params }),

	get: async (baseURL) => axios.get('/branches-days/latest/', { baseURL }),

	create: async (body: ICreateBranchDay, baseURL) =>
		axios.post('/branches-days/', body, { baseURL }),

	edit: async (id: number, body: IEditBranchDay, baseURL) =>
		axios.patch(`/branches-days/${id}/`, body, { baseURL }),
};
