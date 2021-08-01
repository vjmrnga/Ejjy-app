import axios from 'axios';
import { IListRequest } from '../interfaces';

interface ICreateBranch {
	name: string;
	online_url?: string;
	backup_server_url?: string;
	local_ip_address?: string;
}

interface IEditBranch {
	id: number;
	name?: string;
	online_url?: string;
	backup_server_url?: string;
	local_ip_address?: string;
}

export const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/branches/', { baseURL, params }),

	getById: async (id, baseURL) => axios.get(`/branches/${id}/`, { baseURL }),

	create: async (body: ICreateBranch, baseURL) =>
		axios.post('/branches/', body, { baseURL }),

	edit: async (body: IEditBranch, baseURL) =>
		axios.patch(`/branches/${body.id}/`, body, { baseURL }),

	remove: async (id, baseURL) => axios.delete(`/branches/${id}/`, { baseURL }),
};
