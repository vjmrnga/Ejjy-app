import axios from 'axios';
import { IListRequest } from './interfaces';

interface List extends IListRequest {
	branch_machine_id?: boolean;
	time_range?: string;
}

const service = {
	list: async (params: List, baseURL) =>
		axios.get('/bir-reports/', { params, baseURL }),
};

export default service;
