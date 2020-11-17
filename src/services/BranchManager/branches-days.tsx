import axios from 'axios';

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
	get: async (params: IGetBranchDay) => axios.get('/branches-days/latest/', { params }),
	create: async (body: ICreateBranchDay) => axios.post('/branches-days/', body),
	edit: async (id: number, body: IEditBranchDay) => axios.patch(`/branches-days/${id}/`, body),
};
