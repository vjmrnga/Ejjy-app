import axios from 'axios';
import { IListRequest } from './interfaces';

interface Modify {
	name: string;
	divisor_amount: number;
}

const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/point-system-tags/', { baseURL, params }),

	create: async (body: Modify, baseURL) =>
		axios.post('/point-system-tags/', body, { baseURL }),

	edit: async (id: number, body: Modify, baseURL) =>
		axios.patch(`/point-system-tags/${id}/`, body, { baseURL }),

	delete: async (id: number, baseURL) =>
		axios.delete(`/point-system-tags/${id}/`, { baseURL }),
};
export default service;
