import axios from 'axios';
import { IGetRequest } from '../interfaces';

interface ICreateBranch {
	name: string;
	online_url?: string;
}

interface IEditBranch {
	id: number;
	name?: string;
	online_url?: string;
}

export const service = {
	list: async (params: IGetRequest) => axios.get('/branches/', { params }),
	getById: async (id) => axios.get(`/branches/${id}/`),
	create: async (body: ICreateBranch) => axios.post('/branches/', body),
	edit: async (body: IEditBranch) => axios.patch(`/branches/${body.id}/`, body),
	remove: async (id) => axios.delete(`/branches/${id}/`),
};
