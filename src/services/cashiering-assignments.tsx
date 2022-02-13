import axios from 'axios';
import { IListRequest } from './interfaces';

interface ICreateCashieringAssignment {
	user_id: number;
	branch_machine_id: number;
	date: string;
}

interface IEditCashieringAssignment {
	id: number;
	branch_machine_id: number;
}

interface IListCashieringAssignmentsByUserIdRequest extends IListRequest {
	user_id: number;
}

export const service = {
	listByUserId: async (
		params: IListCashieringAssignmentsByUserIdRequest,
		baseURL,
	) => axios.get('/cashiering-assignments/', { baseURL, params }),

	create: async (body: ICreateCashieringAssignment, baseURL) =>
		axios.post('/cashiering-assignments/', body, { baseURL }),

	edit: async (body: IEditCashieringAssignment, baseURL) =>
		axios.patch(`/cashiering-assignments/${body.id}/`, body, { baseURL }),

	remove: async (id, baseURL) =>
		axios.delete(`/cashiering-assignments/${id}/`, { baseURL }),
};
