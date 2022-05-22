import axios from 'axios';
import { IListRequest } from 'services/interfaces';

interface List extends IListRequest {
	acting_user_id: number;
	branch_machine_id: number;
	time_range: string;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/user-logs/', { baseURL, params }),
};

export default service;
