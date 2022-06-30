import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	branch_id?: number;
}

interface Create {
	contact_number: string;
	display_name: string;
	email: string;
	first_name: string;
	last_name: string;
	password: string;
	user_type: string;
	username: string;
}

interface Edit {
	branch_id?: number;
	contact_number?: string;
	display_name?: string;
	email?: string;
	first_name?: string;
	last_name?: string;
	password?: string;
	user_type?: string;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/users/', { baseURL, params }),

	retrieve: async (id, baseURL) => axios.get(`/users/${id}/`, { baseURL }),

	create: async (body: Create, baseURL) =>
		axios.post('/users/', body, { baseURL }),

	edit: async (id, body: Edit, baseURL) =>
		axios.patch(`/users/${id}/`, body, { baseURL }),

	authenticate: async (body, baseURL) =>
		axios.post('/users/authenticate/', body, { baseURL }),

	delete: async (id, baseURL) => axios.delete(`/users/${id}/`, { baseURL }),
};

const serviceOnline = {
	listOnline: async (params, baseURL) =>
		axios.get('/online-users/', { baseURL, params }),

	getByIdOnline: async (id, baseURL) =>
		axios.get(`/online-users/${id}/`, { baseURL }),

	createOnline: async (body: Create, baseURL) =>
		axios.post('/online-users/', body, { baseURL }),

	editOnline: async (id, body: Edit, baseURL) =>
		axios.patch(`/online-users/${id}/`, body, { baseURL }),

	removeOnline: async (id, baseURL) =>
		axios.delete(`/online-users/${id}/`, { baseURL }),

	approveOnline: async (id, body, baseURL) =>
		axios.post(`/online-users/${id}/approve/`, body, { baseURL }),

	requestUserTypeChange: async (id, body, baseURL) =>
		axios.post(`/online-users/${id}/request-user-type-change/`, body, {
			baseURL,
		}),
};

const serviceOffline = {
	listOffline: async (params: List, baseURL) =>
		axios.get('/offline-users/', { baseURL, params }),
};

export default {
	...service,
	...serviceOnline,
	...serviceOffline,
};
