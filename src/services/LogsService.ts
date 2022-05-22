import axios from 'axios';
import { IListRequest } from 'services/interfaces';

interface List extends IListRequest {
	branch_machine_id: number;
	acting_user_id: number;
	time_range: string;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/action-logs/', { baseURL, params }),

	getCount: async (baseURL) => axios.get('/action-logs/count/', { baseURL }),
};

export default service;
