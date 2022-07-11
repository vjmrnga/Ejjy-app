import axios from 'axios';
import { IListRequest } from './interfaces';

interface Create {
	started_by_id: number;
}

interface IEditBranchDay {
	ended_by_id: number;
	online_ended_by_id?: number;
}

const service = {
	list: async (params: IListRequest, baseURL) =>
		axios.get('/branches-days/', { baseURL, params }),

	retrieve: async (baseURL) => axios.get('/branches-days/latest/', { baseURL }),

	create: async (body: Create, baseURL) =>
		axios.post('/branches-days/', body, { baseURL }),

	edit: async (id: number, body: IEditBranchDay, baseURL) =>
		axios.patch(`/branches-days/${id}/`, body, { baseURL }),
};

const serviceAuthorizations = {
	retrieve: async (baseURL) =>
		axios.get('/branches-day-authorizations/latest-today/', { baseURL }),

	create: async (body: Create, baseURL) =>
		axios.post<any>('/branches-day-authorizations/', body, {
			baseURL,
		}),
	end: async (id, baseURL) =>
		axios.post<any>(
			`/branches-day-authorizations/${id}/end/`,
			{},
			{
				baseURL,
			},
		),
};

export default {
	...service,
	...serviceAuthorizations,
};
