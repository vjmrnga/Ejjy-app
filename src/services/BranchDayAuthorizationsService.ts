import axios from 'axios';
import { IListRequest } from 'services/interfaces';

interface ListOffline extends IListRequest {
	branch_id: number;
}

interface Retrieve {
	branch_id: number;
}

interface Create {
	branch_ids: string;
	started_by_id: number;
}

interface End {
	branch_ids: string;
	ended_by_id: number;
}

const service = {
	retrieve: async (params: Retrieve, baseURL) =>
		axios.get('/branches-day-authorizations/latest-today/', {
			baseURL,
			params,
		}),

	create: async (body: Create, baseURL) =>
		axios.post<any>('/branches-day-authorizations/', body, {
			baseURL,
		}),
	end: async (body: End, baseURL) =>
		axios.post<any>(`/branches-day-authorizations/end/`, body, {
			baseURL,
		}),
};

const serviceOffline = {
	listOffline: async (params: ListOffline, baseURL) =>
		axios.get('/offline-branches-day-authorizations/', { baseURL, params }),
};

export default {
	...service,
	...serviceOffline,
};
