import axios from 'axios';
import { IListRequest } from 'services/interfaces';

interface Modify {
	name: string;
	server_url?: string;
	pos_terminal?: string;
}

const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/branch-machines/', { baseURL, params }),

	retrieve: async (id, baseURL) =>
		axios.get(`/branch-machines/${id}/`, { baseURL }),

	create: async (body: Modify, baseURL) =>
		axios.post('/branch-machines/', body, { baseURL }),

	edit: async (id: number, body: Modify, baseURL) =>
		axios.patch(`/branch-machines/${id}/`, body, { baseURL }),
};

export default service;
