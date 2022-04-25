import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	type?: string;
}

interface Modify {
	birthday: string;
	business_address?: string;
	business_name?: string;
	contact_number: string;
	first_name: string;
	gender: string;
	home_address: string;
	is_point_system_eligible: boolean;
	last_name: string;
	middle_name?: string;
	tin: string;
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
