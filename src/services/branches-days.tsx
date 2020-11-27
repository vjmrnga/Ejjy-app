import axios from 'axios';
import { IGetRequest } from './interfaces';

interface IListBranchDays extends IGetRequest {
	branch_id: number;
}

interface IGetBranchDay {
	branch_id: number;
}

interface ICreateBranchDay {
	branch_id: number;
	started_by_id: number;
}

interface IEditBranchDay {
	ended_by_id: number;
}

export const service = {
	list: async (params: IListBranchDays) => axios.get('/branches-days/', { params }),
	get: async (params: IGetBranchDay) => axios.get('/branches-days/latest/', { params }),
	create: async (body: ICreateBranchDay) => axios.post('/branches-days/', body),
	edit: async (id: number, body: IEditBranchDay) => axios.patch(`/branches-days/${id}/`, body),
};
