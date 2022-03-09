import axios from 'axios';
import { IListRequest } from './interfaces';

const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/users/', { baseURL, params }),

	listOnline: async (params, baseURL) =>
		axios.get('/online-users/', { baseURL, params }),

	getById: async (id, baseURL) => axios.get(`/users/${id}/`, { baseURL }),

	getByIdOnline: async (id, baseURL) =>
		axios.get(`/online-users/${id}/`, { baseURL }),

	create: async (body, baseURL) => axios.post('/users/', body, { baseURL }),

	createOnline: async (body, baseURL) =>
		axios.post('/online-users/', body, { baseURL }),

	editOnline: async (id, body, baseURL) =>
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

export default service;
