import axios from 'axios';
import { IListRequest } from './interfaces';

interface Modify {
	account_id?: string;
	credit_limit?: string;
}

const service = {
	list: async (params: IListRequest, baseURL: string) =>
		axios.get('/credit-registrations/', { baseURL, params }),

	create: async (body: Modify, baseURL: string) =>
		axios.post('/credit-registrations/', body, { baseURL }),

	edit: async (id: number, body: Modify, baseURL: string) =>
		axios.patch(`/credit-registrations/${id}/`, body, { baseURL }),
};

const serviceOffline = {
	listOffline: async (params: IListRequest, baseURL) =>
		axios.get('/offline-credit-registrations/', { baseURL, params }),
};

export default {
	...service,
	...serviceOffline,
};
