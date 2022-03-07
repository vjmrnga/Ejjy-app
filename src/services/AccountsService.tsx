import axios from 'axios';
import { IListRequest } from './interfaces';

interface IModify {
	first_name?: string;
	middle_name?: string;
	last_name?: string;
	business_name?: string;
	birthday?: string;
	business_address?: string;
	home_address?: string;
	contact_number?: string;
	gender?: string;
}

const service = {
	list: async (params: IListRequest, baseURL: string) =>
		axios.get('/accounts/', { baseURL, params }),

	create: async (body: IModify, baseURL: string) =>
		axios.post('/accounts/', body, { baseURL }),

	edit: async (id: number, body: IModify, baseURL: string) =>
		axios.patch(`/accounts/${id}/`, body, { baseURL }),
};

export default service;
