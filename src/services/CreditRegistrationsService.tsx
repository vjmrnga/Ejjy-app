import axios from 'axios';
import { IListRequest } from './interfaces';

interface IModify {
	account_id?: string;
	credit_limit?: string;
}

const service = {
	list: async (params: IListRequest, baseURL: string) =>
		axios.get('/credit-registrations/', { baseURL, params }),

	create: async (body: IModify, baseURL: string) =>
		axios.post('/credit-registrations/', body, { baseURL }),

	edit: async (id: number, body: IModify, baseURL: string) =>
		axios.patch(`/credit-registrations/${id}/`, body, { baseURL }),
};

export default service;
