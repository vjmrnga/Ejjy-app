import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	branch_machine_id: number;
	time_range?: string;
	type?: string;
}

const service = {
	list: async (params: List, baseURL = null) =>
		axios.get<any[]>('connectivity-logs/', { baseURL, params }),
};

export default service;
