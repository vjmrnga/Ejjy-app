import axios from 'axios';
import { IListRequest } from 'services/interfaces';

interface List extends IListRequest {
	acting_user_id: number;
	branch_id: number;
	branch_machine_id: number;
	time_range: string;
	branch_product_id: number;
	product_id: number;
	type: string;
}

const service = {
	list: async (params: List, baseURL: string) =>
		axios.get('/user-logs/', { baseURL, params }),
};

const serviceOffline = {
	listOffline: async (params: List, baseURL: string) =>
		axios.get('/offline-user-logs/', { baseURL, params }),
};

export default {
	...service,
	...serviceOffline,
};
