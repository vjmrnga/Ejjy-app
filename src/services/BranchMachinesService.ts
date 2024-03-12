import axios from 'axios';
import { IListRequest } from 'services/interfaces';

interface List extends IListRequest {
	branch_id?: number;
	sales_time_range?: string;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/branch-machines/', { baseURL, params }),

	retrieve: async (id, baseURL) =>
		axios.get(`/branch-machines/${id}/`, { baseURL }),
};

const serviceOffline = {
	listOffline: async (params: List, baseURL) =>
		axios.get('/offline-branch-machines/', { baseURL, params }),

	retrieveOffline: async (id, baseURL) =>
		axios.get(`/offline-branch-machines/${id}/`, { baseURL }),
};

export default {
	...service,
	...serviceOffline,
};
