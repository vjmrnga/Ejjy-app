import axios from 'axios';
import { IListRequest } from '../interfaces';

interface IEditPendingTransaction {
	is_pending_approval: boolean;
}

export const service = {
	list: async (params, baseURL) =>
		axios.get('/pending-database-transactions/', { baseURL, params }),

	count: async (params, baseURL) =>
		axios.get('/pending-database-transactions/count/', { baseURL, params }),

	edit: async (id, body: IEditPendingTransaction, baseURL) =>
		axios.patch(`/pending-database-transactions/${id}/`, body, { baseURL }),

	remove: async (id, baseURL) =>
		axios.delete(`/pending-database-transactions/${id}/`, { baseURL }),

	execute: async (configuration) => axios(configuration),
};
