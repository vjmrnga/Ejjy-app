import axios from 'axios';
import { IGetRequest } from '../interfaces';

interface ICreateBranch {}

interface IEditBranch {
	id: number;
}

export const service = {
	list: async (params: IGetRequest) => axios.get('/preparation-slips/', { params }),
	listExtended: async (params: IGetRequest) => axios.get('/preparation-slips/', { params }),
	create: async (body: ICreateBranch) => axios.post('/preparation-slips/', body),
	edit: async (body: IEditBranch) => axios.patch(`/preparation-slips/${body.id}/`, body),
};
