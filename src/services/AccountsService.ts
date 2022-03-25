import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	type?: string;
}

interface Modify {
	first_name: string;
	middle_name?: string;
	last_name: string;
	business_name?: string;
	tin: string;
	birthday: string;
	business_address?: string;
	home_address: string;
	contact_number: string;
	gender: string;
	type: string;
}

const service = {
	list: async (params: List, baseURL: string) =>
		axios.get('/accounts/', { baseURL, params }),

	create: async (body: Modify, baseURL: string) =>
		axios.post('/accounts/', body, { baseURL }),

	edit: async (id: number, body: Modify, baseURL: string) =>
		axios.patch(`/accounts/${id}/`, body, { baseURL }),
};

export default service;
