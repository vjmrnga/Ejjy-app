import axios from 'axios';
import { IGetRequest } from '../interfaces';

interface ICreateBranch {
	name: string;
}

interface IEditBranch {
	id: number;
	name?: string;
}

export const service = {
	list: async (params: IGetRequest) => axios.get('/branches/', { params }),
	getBranch: async (id) => axios.get(`/branches/${id}/`),
	createBranch: async (body: ICreateBranch) => axios.post('/branches/', body),
	editBranch: async (body: IEditBranch) => axios.patch(`/branches/${body.id}/`, body),
	removeBranch: async (id) => axios.delete(`/branches/${id}/`),
};
