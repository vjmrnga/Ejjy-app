import axios from 'axios';
import { IListRequest } from './interfaces';

interface IList extends IListRequest {
	branch_machine_id?: number;
	statuses?: string;
	time_range?: string;
	mode_of_payment?: string;
}

const service = {
	list: async (params: IList, baseURL) =>
		axios.get('/transactions/', { baseURL, params }),
};

export default service;
