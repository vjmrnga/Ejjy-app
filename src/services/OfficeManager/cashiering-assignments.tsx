import axios from 'axios';
import { IGetRequest } from '../interfaces';

interface ICreateCashieringAssignment {
	user_id: number;
	branch_machine_id: number;
	date: string;
}

interface IEditCashieringAssignment {
	id: number;
	branch_machine_id: number;
}

interface IListCashieringAssignmentsByUserIdRequest extends IGetRequest {
	user_id: number;
}

export const service = {
	listByUserId: async (
		params: IListCashieringAssignmentsByUserIdRequest,
		baseURL,
	) => axios.get('/cashiering-assignments/', { baseURL, params }),

	getById: async (id, baseURL) => axios.get(`/branches/${id}/`, { baseURL }),

	create: async (body: ICreateCashieringAssignment, baseURL) =>
		axios.post('/cashiering-assignments/', body, { baseURL }),

	edit: async (body: IEditCashieringAssignment, baseURL) =>
		axios.patch(`/cashiering-assignments/${body.id}/`, body, { baseURL }),

	remove: async (id, baseURL) =>
		axios.delete(`/cashiering-assignments/${id}/`, { baseURL }),
};
