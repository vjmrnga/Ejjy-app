import axios from 'axios';
import { IListRequest } from './interfaces';

interface Create {
	name: string;
	online_url?: string;
}

interface Edit {
	name?: string;
	online_url?: string;
}

const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/branches/', { baseURL, params }),

	retrieve: async (id, baseURL) => axios.get(`/branches/${id}/`, { baseURL }),

	create: async (body: Create, baseURL) =>
		axios.post('/branches/', body, { baseURL }),

	edit: async (id, body: Edit, baseURL) =>
		axios.patch(`/branches/${id}/`, body, { baseURL }),

	delete: async (id, baseURL) => axios.delete(`/branches/${id}/`, { baseURL }),
};

const serviceOffline = {
	listOffline: async (params: IListRequest, baseURL) =>
		axios.get('/offline-branches/', { baseURL, params }),

	retrieveOffline: async (id, baseURL) =>
		axios.get(`/offline-branches/${id}/`, { baseURL }),
};

export default {
	...service,
	...serviceOffline,
};
