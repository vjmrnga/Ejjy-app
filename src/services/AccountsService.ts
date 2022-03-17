import axios from 'axios';
import { IListRequest } from './interfaces';

interface IList extends IListRequest {
	type?: string;
}

interface IModify {
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
	list: async (params: IList, baseURL: string) =>
		axios.get('/accounts/', { baseURL, params }),

	create: async (body: IModify, baseURL: string) =>
		axios.post('/accounts/', body, { baseURL }),
};

export default service;
