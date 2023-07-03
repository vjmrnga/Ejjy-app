import axios from 'axios';
import { IListRequest } from 'services/interfaces';

interface List extends IListRequest {
	is_with_daily_sales_data: boolean;
	time_range: string;
}

interface Create {
	branch_machine_id: number;
	cashiering_session_id: number;
	date: string;
	user_id: number;
}

const service = {
	list: async (params: List, baseURL: string) =>
		axios.get('/xread-reports/', { baseURL, params }),

	create: async (body: Create, baseURL) =>
		axios.post('/xread-reports/', body, { baseURL }),
};

export default service;
